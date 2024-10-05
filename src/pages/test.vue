<template>
    <div class="home-page">
      <header class="header">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc5c0b73d8408c87dada11f2faccad8e763b321344fea9794213928ead220050?placeholderIfAbsent=true&apiKey=f5d3deb5b711427198b584743c1a29f0" alt="" class="background-image" />
        <div class="header-content">
          <div class="logo-container">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/91078e0ccf01ecfaf78d14bc340b22353119be654f170d82a1698ab0cff4fdac?placeholderIfAbsent=true&apiKey=f5d3deb5b711427198b584743c1a29f0" alt="Gaia Room Logo" class="logo" />
            <h1 class="brand-name">Gaia Room</h1>
          </div>
          <nav class="main-nav">
            <ul class="nav-list">
              <li><a href="#education" class="nav-link">Education</a></li>
              <li><a href="#event" class="nav-link">Event</a></li>
              <li><a href="#lab" class="nav-link">Lab</a></li>
              <li><a href="#challenge" class="nav-link">Challenge</a></li>
              <li><a href="#tour" class="nav-link">Tour</a></li>
              <li><a href="#about" class="nav-link">About</a></li>
            </ul>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0652ce0bd3940ab4e7df9bd32b05c49f3122a6ced6caceaaef9aa099bd2163bf?placeholderIfAbsent=true&apiKey=f5d3deb5b711427198b584743c1a29f0" alt="Menu Icon" class="menu-icon" />
          </nav>
        </div>
      </header>
      
      <main class="main-content">
        <section class="hero-section">
          <h2 class="hero-title">Look beyond Earth.<br />Explore with us!</h2>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/67233c807d679198b7376b664199a240361403a147eec5c87d464de8505cdf14?placeholderIfAbsent=true&apiKey=f5d3deb5b711427198b584743c1a29f0" alt="Explore Icon" class="explore-icon" />
        </section>
        <section class="features-grid">
          <div class="feature-column">
            <article class="feature-card virtual-orrery">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0361665e73962b9ff3456c4fc4311e1f2fbf0539c9485f710df84cef1c5e8d69?placeholderIfAbsent=true&apiKey=f5d3deb5b711427198b584743c1a29f0" alt="" class="feature-background" />
              <h3 class="feature-title">Virtual Orrery</h3>
              <p class="feature-description">Let's explore<br />the Solar System!</p>
            </article>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/4812a1ac-8374-4a24-bf78-6adaca1e441b?placeholderIfAbsent=true&apiKey=f5d3deb5b711427198b584743c1a29f0" alt="Solar System Illustration" class="solar-system-image" />
            <article class="feature-card lab">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/19c70f14eb0acdec097a3c9305a12986df0e6a84f7b713abfbd929241dac3979?placeholderIfAbsent=true&apiKey=f5d3deb5b711427198b584743c1a29f0" alt="" class="feature-background" />
              <h3 class="feature-title">Lab</h3>
              <p class="feature-description">Conduct an<br />experiment<br />about stars</p>
            </article>
            <article class="feature-card education">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/c662bb977ecae7760a7fecde3d7ccc8c6ef936ccd82e523c053af08f9cea6108?placeholderIfAbsent=true&apiKey=f5d3deb5b711427198b584743c1a29f0" alt="" class="feature-background" />
              <h3 class="feature-title">Education</h3>
              <p class="feature-description">A better way<br />to present astronomy</p>
            </article>
          </div>
          <div class="feature-column">
            <article class="feature-card challenge">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/826aaf9889d4f6cdafa318311fbc537ec207165baa618312b745ddc44d0467a6?placeholderIfAbsent=true&apiKey=f5d3deb5b711427198b584743c1a29f0" alt="" class="feature-background" />
              <h3 class="feature-title">Challenge</h3>
              <p class="feature-description">Test your<br />knowledge!</p>
            </article>
            <article class="feature-card tour">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0494cdf60962f52d22d99508b2ddd9787e669e1fca3a959affbb71b4a518c0e3?placeholderIfAbsent=true&apiKey=f5d3deb5b711427198b584743c1a29f0" alt="" class="feature-background" />
              <h3 class="feature-title">Tour</h3>
              <p class="feature-description">Let's visit<br />the Solar System's<br />landmarks!</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <style scoped>
  .home-page {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .header {
    position: relative;
    min-height: 1280px;
    padding: 43px 60px;
  }
  
  .background-image {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  .header-content {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font: 800 20px Gilroy, sans-serif;
    letter-spacing: 2px;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    color: #fff;
  }
  
  .logo {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  
  .main-nav {
    display: flex;
    align-items: center;
  }
  
  .nav-list {
    display: flex;
    gap: 40px;
    list-style-type: none;
    padding: 13px 37px;
    border-radius: 25px;
    border: 2px solid #fff;
    background-color: rgba(217, 217, 217, 0.1);
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
  }
  
  .nav-link {
    color: #9e9e9e;
    text-decoration: none;
  }
  
  .menu-icon {
    width: 35px;
    height: 35px;
    margin-left: 23px;
  }
  
  .hero-section {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 59px;
    color: #fff;
    font: 800 64px/80px Gilroy, sans-serif;
    letter-spacing: 6.4px;
  }
  
  .explore-icon {
    width: 70px;
    height: 70px;
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
  }
  
  .features-grid {
    display: flex;
    gap: 20px;
    margin-top: 80px;
  }
  
  .feature-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .feature-card {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
    color: #fff;
    font-family: Gilroy, sans-serif;
    font-weight: 800;
  }
  
  .feature-background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .feature-title {
    position: relative;
    font-size: 40px;
    line-height: 1;
    letter-spacing: 4px;
    text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
    margin: 0;
    padding: 30px 35px;
  }
  
  .feature-description {
    position: relative;
    font-size: 24px;
    line-height: 35px;
    letter-spacing: 2.4px;
    text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
    margin-top: auto;
    padding: 0 35px 30px;
  }
  
  .virtual-orrery {
    min-height: 380px;
  }
  
  .solar-system-image {
    width: 100%;
    aspect-ratio: 0.93;
    object-fit: contain;
    box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.5);
  }
  
  .lab {
    aspect-ratio: 0.856;
  }
  
  .education {
    min-height: 410px;
  }
  
  .challenge {
    aspect-ratio: 1.243;
  }
  
  .tour {
    aspect-ratio: 0.523;
  }
  
  @media (max-width: 991px) {
    .header {
      padding: 20px;
    }
  
    .header-content {
      flex-direction: column;
      align-items: stretch;
    }
  
    .nav-list {
      flex-wrap: wrap;
      justify-content: center;
      padding: 10px;
    }
  
    .hero-section {
      flex-direction: column;
      align-items: center;
      margin-top: 40px;
      font-size: 40px;
      line-height: 55px;
    }
  
    .features-grid {
      flex-direction: column;
      margin-top: 40px;
    }
  
    .feature-card {
      padding: 20px;
    }
  
    .feature-description {
      margin-top: 40px;
    }
  }
  </style>