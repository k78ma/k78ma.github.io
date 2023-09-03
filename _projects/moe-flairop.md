---
layout: page
title: MoE-FLAIROP
description: Mixture-of-Experts adaptive model ensemble to improve classification for similar objects.
img: assets/img/moe-flairop.png
importance: 1
category: code unavailable / in-progress
---

Public code is not yet available for this project, which was completed as part of my internship at the University of Waterloo's Vision and Image Processing (VIP) Lab. This project was a part of the FLAIROP (Federated Learning for Robot Picking) iniative, a partnership between the VIP Lab, DarwinAI, FESTO, and the Karlsruhe Institute of Technology.

### Project Summary

The specific problem I worked to address was data imbalance for object detection on the MetaGraspNet dataset. Specifically, we found that after training one network with all classes on the dataset and generating a confusion matrix, certain classes suffered from much lower accuracy. A particularly prevalent issue causing this was high similarity between classes; for example, screws that have identical heads but different bodies.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/djtoyairplane.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Highly similar toy airplane screw objects and confusion matrix.
</div>

We found that splitting the classes that are more difficult to train and training individual networks on these specific datasets led to an improvement in performance. For example, for our representative case of screws, we created a sub-dataset of MetaGraspNet, where every image contained at least one screw. Then, we only ask create an **expert model** to identify these two classes instead of all 97 classes in MetaGraspNet.

This expert model approach proved to be successful, so our general solution was to use adaptive mixture-of-experts (MoE) model ensembles, which allow us to combine the predictions of trained models. We also considered other ways of combining expert predictions, such as bounding box ensembling, but found MoE to be the most versatile. MoE follows this general approach:
- Decompose task into sub-tasks, which are delegated to experts
- Use ”gating network” that learns which expert to trust for a given task
- Either directly which expert to use or combine expert predictions

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.html path="assets/img/moe-arch.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    MoE Architecture.
</div>

We conducted various experiments to improve and gain a better understanding of the expert models and the MoE system. These include:
- **"Superclass" experiment:** Combining expert classes into a superclass to make sure general model can first identify objects that belong to these two classes
- **Architecture experiments:** Freezing various parts of the model architecture and trying out different feature backbones to identify bottlenecks in classification performance
- **Scene difficulty experiments:** Examining model output for images of various difficulties to understand model performance under different circumstances.


<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/difficulty_experiments.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Experiment for a difficult case with expert/original model performances.
</div>

### MoE Proof-of-Concept Implementation

I implemented a simple MoE proof-of-concept based on MMDetection’s TwoStageDetector class. This allows us to use the utilities of the MMDetection library, which includes many useful tools. Some main features are listed here.
I changed the initialization of the class to also take arguments for ”experts” (a list of trained
models) and ”gating network” (described below).

{% raw %}
```python
class MixtureOfExpertsTwoStageDetector(TwoStageDetectorMoE):
    def __init__(self, experts, gating_network, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.experts = experts
        self.gating_network = gating_network
```
{% endraw %}

Then, I changed the forward pass for the training function (“forward train”) to:
- Calculate gate values using the gating network
- Select an expert based on the output of the gating network
- Extract features from the expert using the selected expert
{% raw %}
```python
# Calculate gate values using the gating network
gate_probabilities = self.gating_network(img)

# Find highest gate value (most confident value)
selected_expert = self.experts[torch.argmax(gate_probabilities)]

# Extract features using the expert with highest confidence
x = selected_expert.extract_feat(img)
```
{% endraw %}

I chose to design this in this manner according to our architecture experiments, where we determined that the backbone feature extraction is the most crucial stage. A similar gate-based feature extraction is also included in the forward pass of the testing function.

I experimented with **gating networks** that take an input image and output a set of weights, essentially allowing us to choose an expert to use based on their confidence. Several different architectures; the one shown below is a simple example. Here is the way I defined the gating network:
- Defined the input and output layers of the gating network. The input layer takes the input
image, and the output layer output the model confidences for each of the expert models.
- Defined hidden layers of the gating network, as well as activation functions (ReLU).

{% raw %}
```python
# Simple GatingNetwork class
class GatingNetwork(torch.nn.Module):
    def __init__(self, input_size, num_experts):
        super().__init__()
        self.fc1 = torch.nn.Linear(input_size, 64)
        self.fc2 = torch.nn.Linear(64, num_experts)
        # check if a GPU is available
        if torch.cuda.is_available():
            # move the fc1 and fc2 layers to the GPU
            self.fc1 = self.fc1.cuda()
            self.fc2 = self.fc2.cuda()

    def forward(self, input, test_mode=False):
        if test_mode:
            # reshape the input tensor to (batch_size, 2 * input_size)
            #x = torch.relu(self.fc1(input.view(-1, 800 * 800 * 3)))
            x = torch.relu(self.fc1(input.view(-1, 1 * 800 * 800 * 3)))
            pass
        else:
            # reshape the input tensor to (batch_size, input_size)
            x = torch.relu(self.fc1(input.view(-1, 2 * 800 * 800 * 3)))
        x = self.fc2(x)
        return torch.sigmoid(x)
```
{% endraw %}

In order to allow the gating network to be trainable during the whole training process, I added a custom hook, which trains the gating network after every training iteration. This hook is optional.
