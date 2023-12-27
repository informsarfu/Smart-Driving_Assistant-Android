import React, {useEffect, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Button from './shared/Button';
import {useVolumeControl} from '../hooks/useVolumeControl';

const VolumeChangeAmount = 0.1;
let prevVolume = 0;
// let currVolume = 0;
// const arr_slow_volume = [];
// const arr_normal_volume = [];
// const arr_jam_volume = [];
const presetNormal = 0.8;
const presetSlow = 0.5;
const presetJam = 0.3;

function generateRandomRoadConditionSequence(length) {
  var sequence = '';
  for (var i = 0; i < length; i++) {
    var randomNumber = Math.floor(Math.random() * 3); // Generate a random number between 0 and 2
    sequence += randomNumber;
  }
  return sequence;
}

var randomRoadSequence = generateRandomRoadConditionSequence(50);
console.log(randomRoadSequence);

for(let i = 0; i< randomRoadSequence.length; i++) {
	if(currRoadCondition == 0) {
		//Slow
		slow_object.add(presetSlow);
		slow_object.add(presetNormal);
		slow_object.add(presetJam);
    console.log(slow_object.getAverage());
	} else if (currRoadCondition == 1) {
		//Normal
		normal_object.add(presetNormal);
		normal_object.add(presetSlow);
		normal_object.add(presetJam);
    console.log(normal_object.getAverage());
	} else {
		//TrafficJam
		jam_object.add(presetJam);
		jam_object.add(presetNormal);
		jam_object.add(presetSlow);
    console.log(jam_object.getAverage());
	}
}

function MovingAverage(windowSize) {
  this.window = [];
  this.windowSize = windowSize;
  this.sum = 0;

  this.add = function(value) {
    this.window.push(value);
    this.sum += value;
    if (this.window.length > this.windowSize) {
      var removedValue = this.window.shift();
      this.sum -= removedValue;
    }
  };

  this.getAverage = function() {
    return this.sum / this.window.length;
  };
}

export default function VolumeControl() {
  const {volume, increaseVolume, decreaseVolume, cleanup} = useVolumeControl();

  var slow_object = new MovingAverage(5);

  var normal_object = new MovingAverage(5);

  var jam_object = new MovingAverage(5);

  useEffect(() => {
    () => {
      cleanup();
    };
  }, []);

  const doVolumeChange = async (
    v,
    increase = true,
    amount = VolumeChangeAmount,
  ) => {
    prevVolume = volume;

    if (increase) {
      await increaseVolume(amount);
    } else await decreaseVolume(amount);

    if(road_condition == 0) {
      slow_object.add(volume-prevVolume);
    } else if (road_condition == 1) {
      normal_object.add(volume-prevVolume);
    } else {
      jam_object.add(volume-prevVolume);
    }
  };

  const onVolumeChange = useCallback(async (increase = true) => {
    console.log('onVolumeChange()');
    await doVolumeChange(volume, increase, VolumeChangeAmount);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.headline}>Volume: {volume}</Text>
        </View>
        <View style={styles.column}>
          <View style={styles.buttonContainer}>
            <Button title="Volume up" onPress={() => onVolumeChange(true)} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Volume down" onPress={() => onVolumeChange(false)} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  column: {
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  headline: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
