# smarter power point
Network notification for coffee machines and electric kettle using AVM Fritz!DECT in smarthome. Not only useful for Java developers.

**We exclude any liability whatsoever for any damages whatsoever that this software may cause.**

**Attention**: This is a very **unsecure** implementation. Use it only if you know what you're doing.

## Installation
To install clone this repository using the following commands:
<pre>
$ git clone https://github.com/orcas-internet/smarter_power_point.git
$ cd smarter_power_point
</pre>      
  
#### Install Service
First of all you have to configure your Fritz!DECT connection. To do this simply create a copy of 
<code>config.dist.js</code> and name it <code>config.js</code> and then adapt the configuration keys to your needs.

To install the nodeJS-Service run the following commands from the repository root directory (we assume, that nodeJS and 
npm are installed on your system and available from the commandline):
<pre>
$ cd service
$ npm install
$ npm run service
</pre>

#### Install chrome-extension
To install the chrome extension follow these steps (start in repository root directory):
<pre>
$ cd chrome
$ ./tar.sh
</pre>

This command has created a tar.gz-File in service folder. If you now visit the index page of your service, you should be 
able to download the file and install it as a packed extension under <code>chrome://extensions</code>

When your extension was loaded, you can open a popup by simply clicking on it's icon.

Now insert the url of the nodeJS web-service and click on &quot;Update&quot;.

To add a new device click on &quot;+&quot;-Button and fill in the following **required** fields:
<pre>
Gerätename: Wasserkocher
min. Leistung: 1700
max. Leistung: 1900
Bild: img/water.jpg <sup>1</sup>
Start Text: Wasserkocher angeschaltet
End Text: Wasserkocher fertig!
</pre>

Now click on &quot;Save&quot; and then &quot;Update&quot;

<sup>1</sup>
The following image files are available:

    - img/coffee.jpg
    - img/water.jpg

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