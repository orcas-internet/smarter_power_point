# smarter power point
Network notification for coffee machines and electric kettle using AVM Fritz!DECT in smarthome. Not only useful for Java
developers.

**We exclude any liability whatsoever for any damages whatsoever that this software may cause.**

**Attention**: This is a very **unsecure** implementation. Use it only if you know what you're doing.

## Installation
To install clone this repository using the following commands:
<pre>
$ git clone https://github.com/orcas-internet/smarter_power_point.git
$ cd smarter_power_point
</pre>      
  
### Install service
First of all you have to configure your Fritz!DECT connection. To do this simply go into <code>service</code> folder,
create a copy of <code>config.dist.js</code> and name it <code>config.js</code> and then adapt the configuration keys to
your needs.
<pre>
$ cd service
$ cp config.dist.js config.js
$ vi config.js
</pre>

To install the nodeJS-Service run the following commands from the repository root directory (we assume, that nodeJS and 
npm are installed on your system and available from the commandline):
<pre>
$ npm install
$ npm run service
</pre>

### Make chrome-extension downloadable
That is only necessary, if the chrome extension should be installed on other host as repository. Follow these steps and
start in repository root directory:
<pre>
$ cd chrome
$ ./tar.sh
</pre>

This command has created a tar.gz-File in service folder. If you now visit the index page of your service, 
e.g. <code>http://localhost:3001/</code> you should be able to download the file.

### Install chrome-extension
To install the chrome extension go to <code>chrome://extensions</code>, switch on the developer mode, use &quot;Load 
unpacked extension&quot; and choose folder <code>chrome/app</code> from the repository or the downloaded and unpacked 
extension. When your extension was loaded, you can open a popup by simply clicking on new icon &quot;orcas Smarter Power 
Point&quot; in chrome toolbar.

Now insert the url of the nodeJS web-service (e.g. <code>http://localhost:3001/</code>) and click on &quot;Update&quot;.

To add a new device click on &quot;+&quot;-Button and fill in the following **required** fields:
<pre>
device name: water heater
min. power: 1700
max. power: 1900
image: img/water.jpg <sup>1</sup>
start text: water heater started
start sound: audio/water_start.mp3 <sup>2</sup>
end text: water heater finished
end sound: audio/water_finished.mp3 <sup>2</sup>
</pre>
Now click on &quot;Save&quot; (below) and then &quot;Update&quot;

Here an other example:
<pre>
device name: coffee machine
min. power: 700
max. power: 800
image: img/coffee.jpg <sup>1</sup>
start text: coffee started
start sound: audio/coffee_start.mp3 <sup>2</sup>
end text: coffee finished
end sound: audio/coffee_finished.mp3 <sup>2</sup>
</pre>

<sup>1</sup>
The following image files are available:

    - img/coffee.jpg
    - img/water.jpg

<sup>2</sup>
The following audio files are available:

    - audio/coffee_start.mp3
    - audio/coffee_finished.mp3
    - audio/water_start.mp3
    - audio/water_finished.mp3

Last but no least change the notification settings for the new device using the provided select box.

      none // if no notification should be displayed
      start // if notification should be displayed only if the machine is start
      finished // if notification should be displayed only if the machine is finished
      start+finished // if notification should be displayed if the machine is start and finished
      
Now hit "Save"!