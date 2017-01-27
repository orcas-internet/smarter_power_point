# smarter power point
Network notification for coffee machines and electric kettle using AVM Fritz!DECT in smarthome. Not only useful for java developers.

**We exclude any liability whatsoever for any damages whatsoever that this software may cause.**

**Attention**: this is a very **unsecure implementation**. Use it only if you know what you do.

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

- configure extensions by click on the extension icon

- insert url to the configured web server

      http://127.0.0.1:8003
      
- click on "Update" to check connection to service. Under state should be the current date

- click on "+" to add device, which should be connected to power point e.g.

      name: coffee machine // name of machine
      min:  700            // minimum elektric power, if machine is on
      max:  800            // maximum elektric power, if machine is on
      
- click on "save"

- click on "Update", the setting for "coffee machine" should be appear under "Notifications"

- change settings for coffee machine

      none // if no notification should be displayed
      start // if notification should be displayed only if the machine is start
      finished // if notification should be displayed only if the machine is finished
      start+finished // if notification should be displayed if the machine is start and finished
      
- click on "Save"