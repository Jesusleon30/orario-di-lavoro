import React from 'react';
import './index-video.css'; // Asegúrate de tener la clase adecuada para el estilo

export default function BackgroundVideo() {
  return (

    <>
    
    <div className="video-background-container">
      {/* <video
        // src="./assets/videoMobile/2mob.mp4"
        src="./assets/videosWeb/chip12.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="video-background"
      ></video> */}
     
    </div>

       <div className="video-background-container">
        {/* <img src="./assets/mobile/aurora3.jpg" alt="" /> */}
        <img className='hidden xl:block w-full h-full' src="./assets/desktop/aurora5.png" alt="" />

        <img className='xl:hidden w-full h-full ' src="./assets/mobile/chip-mobile2.png" alt="" />
       </div>

      </>
  );

}