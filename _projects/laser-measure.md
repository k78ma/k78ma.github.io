---
layout: page
title: (MTE 201) Laser Measurement System
description: Measuring lengths of objects by dropping them across a laser; built with Arduino.
img: assets/img/laser-measure.png
importance: 1
category: school projects
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

