# smarter power point
Network notification for coffee machines and electric kettle using AVM Fritz!DECT in smarthome. Not only useful for java developers.

## install

- clone repository

      projects# git clone https://github.com/orcas-internet/smarter_power_point.git
      projects# cd smarter_power_point      
  
### install service

- go into service folder

      projects/smarter_power_point# cd service
    
- install npm

      projects/smarter_power_point/service# sudo npm install npm -g
  
- install necessary packages

      projects/smarter_power_point/service# npm install
      
- configure service

      projects/smarter_power_point/service# cp config.dist.js config.js
      projects/smarter_power_point/service# vim config.js
      
- configure Apache or nginx to use service/ folder as document root

    e.g. as `http://127.0.0.1:8003`
    
- start the service

      projects/smarter_power_point/service# node smarterPowerPoint.js

### install chrome extension

- go into chrome extension settings

      url# chrome://extensions/
      
- enable developer mode

- load unpacked extension from

      projects/smarter_power_point/chrome/app

- configure extensions