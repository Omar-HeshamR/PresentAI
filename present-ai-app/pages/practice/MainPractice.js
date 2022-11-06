import React from 'react'
import styled from 'styled-components'
import Webcam from "react-webcam";
import { useRef, useState, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import * as fp from "fingerpose";
import { truncatedNormal } from '@tensorflow/tfjs';

const MainPractice = () => {
  const webcamRef = useRef(null);

  // const [running, setRunning] = useState(false)
  let running = false
  // const [running, setRunning] = useState({isRunning: true})
  const handStates = []

  let totalTime = 0;
  let handTime = 0;

  function stopRun(){
    running = false
    // console.log('Running value: ', getRunning())
    console.log(createOutput())
    totalTime = 0
    handTime = 0
    handStates.length = 0
    // const isRunning = running['isRunning']
    // setRunning({isRunning: false})
    // console.log('Running value',running)
    // console.log('stopped!')
    // clearInterval(inter)
    // console.log('cleared')
  }

  function startRun() {
    running = true
    // console.log('Running value:', getRunning())
    // const isRunning = running['isRunning']
    // setRunning({isRunning: true})
    // console.log('Running value', running)
    // console.log('started')
    // guessHands()
  }
  //Functions for hands
  
  // const getRunning = useCallback(() => {
  //   return [running]
  // }, [running])


  async function guessHands(){
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      //runtime
      runtime: 'tfjs', 
      modelType: 'full'
    };
    console.log('guess hands running')
    const detector = await handPoseDetection.createDetector(model, detectorConfig);
    setInterval(() => {

      // console.log('looping')
      if(running){
        detect(detector)
      }else{
        // handStates = []
      }
    }, 800)

  } //use 90 for setInterval

  
  async function detect(detector){
    // console.log(running)
    //   console.log('detecting...')

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {

      //add to the totalTime
      totalTime += 1

      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const hands = await detector.estimateHands(video)
      if(hands.length > 0){
        //iterate over each hand
        let total = null
        const handArr = []
        for(let hand of hands){
          handTime += 1
          //convert the keypoints to 'landmarks'
          const landmarks = []
          const wristZ = hand.keypoints3D[0].z
          for(let i = 0; i < 21; i++){
            let arr = []
            arr.push(hand.keypoints[i].x)
            arr.push(hand.keypoints[i].y)
            let dif = hand.keypoints3D[i].z - wristZ
            arr.push(dif)
            landmarks.push(arr)
          }
          handArr.push(landmarks);
          // console.log(landmarks)
        }
        handStates.push(handArr)

      }else{
        handStates.push([])
      }
      // console.log('HandTime:', handTime)
      // console.log('totalTime:', totalTime)
      // console.log('HandPercent', handPercent)
      // console.log('HandStates', handStates)
      console.log('end of line')
      // if(handStates.length > 50){
      //   gradeMovement()
      //   handStates.length = 0
      // }
    }
  }

  function createOutput(){
    let timeFrac = handTime / totalTime
    let movementGrade = gradeMovement()
    console.log(movementGrade)
    if(isNaN(timeFrac) || typeof(timeFrac) == 'undefined'){
      timeFrac = 0
    }
    console.log(typeof(movementGrade))
    if(isNaN(movementGrade) || typeof(movementGrade) == 'undefined'){
      movementGrade = 0
    }
    console.log(movementGrade)
    return [timeFrac, movementGrade]
  }



  function gradeMovement() {
    console.log('grading movement')

    const movements = seperateMoves()

    const score = judgeMovement(movements)

    console.log('Score for movements:', score)
    return score
  }


  function seperateMoves(){
    const movements = []
    let movement = []
    for(let i=0; i < handStates.length; i++){
      if(handStates[i].length == 0){
        if(movement.length != 0){
          movements.push(movement)
          movement = []
        }
      }else if(i == handStates.length - 1){
        movements.push(movement)
        movement = []
      }else{
        movement.push(handStates[i][0])
      }
    }
    console.log('Movements', movements)
    return movements
  }

  


  function judgeMovement(movements){
    //runs for each full movement
    const moveAverages = []
    for(let i=0; i<movements.length; i++){


      console.log('Movement #1')
      //one individual movement
      const movementDistance = []

      if(movements[i].length > 1){
        for(let j=0; j< movements[i].length - 1; j++){
          //runs for knuckle position in movement
          const knuckDistances = []
          for(let k=0; k < 21; k++){
            const distanceBetweenKnucks = getDistance(movements[i][j][k][0], movements[i][j][k][1], movements[i][j + 1][k][0], movements[i][j + 1][k][1])
            knuckDistances.push(distanceBetweenKnucks)
          }
          movementDistance.push(knuckDistances)
        }
      console.log('Movement distance', movementDistance)

      //getting the average
      let average = 0
      const averages = []
      for(let c=0; c < 20; c++){
        const knucks = []
        for(let d=0; d < movementDistance.length; d++){
          knucks.push(movementDistance[d][c])
        }
        averages.push(getAverage(knucks))
      }
      average = getAverage(averages)
      moveAverages.push(average)

      }
    }
    
    console.log('average gesture movements:', moveAverages)
    const result = getAverage(moveAverages)
      // if(typeof(result) == 'undefined' || typeof(result) == NaN){
      //   return 0
      // }else{
        return result
      // }
  }


  function getAverage(lst){
    let total = 0;
    for(let i = 0; i < lst.length; i++) {
      total += lst[i];
    }
    return total / lst.length;
  }


  function getDistance(x1, y1, x2, y2){
    let y = x2 - x1;
    let x = y2 - y1;
    
    return Math.sqrt(x * x + y * y);
}

  //experimentation
  // useEffect(()=>{
    
    
  //   guessHands()
  
  
  
  
  //   },[]);

  guessHands()



  return (
    <Section>
      <CameraDiv>
        <Webcam
          ref={webcamRef}
          mirrored={true}
        >
        </Webcam>
        
      </CameraDiv>
      <button onClick={startRun}>Run</button>
      <button onClick={stopRun}>Stop</button>
    </Section>
  )
}


const Section = styled.section`
  font-family: "Outfit", sans-serif; 
  display: flex;
  // justify-content: center;
  align-items: center;
  height: 50vw;
  flex-direction: column;
  background-color: #99ccff;
`
const CameraDiv = styled.div`
border: 10px solid white;
margin-top: 2.5vw;
display: flex;
justify-content: center;
`

export default MainPractice