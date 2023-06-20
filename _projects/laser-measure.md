---
layout: page
title: (MTE 201) Measurement System
description: Measuring lengths of objects by dropping them across a laser; built with Arduino.
img: assets/img/laser-measure-cover.jpg
importance: 2
category: school projects
---
### Project Summary

The goal of this project was to design a measurement system for determining the lengths of LEGO blocks using unconventional. The measruement system we came up with consists of an Arduino, a laser, a photoresistors, a breadboard, and some resistors and wires. All of the electrical components are connected on the breadboard and held together by a cardboard apparatus. The cardboard frame was constructed with scotch tape and some glue. The measuring system also features an inclined plane with a layer of tin foil on its surface. The objects that will be measured will be placed on a “sled” with a similar tin foil surface at its bottom. The idea is to use a standard surface between the inclined plane and sled to ensure the same friction coefficient is being used for every object. 

To measure the length of a Lego block, it will be dropped on the inclined plane. The laser, which is placed near the bottom, will be powered and pointing at the photo resistor. The Arduino will detect this and label it as “Clear.” Once the Lego block falls down the inclined plane and passes the laser, it will block its light from hitting the photoresistor, which will be detected by the Arduino as “Blocked.” Once the Lego block fully passes the laser, the photoresistor will be able to detect it once again. The period of time when the photoresistor is not able to detect the laser is the data which will be used to measure the length of the Lego block. During this time period, the Arduino will increment a counter at a certain frequency (that can be adjusted for different resolutions of measurement). The counter the Arduino will record is the raw data to be used for calibration and measurement.  

