var suda = require('../suda.js');
var ytdl = require('ytdl-core');

module.exports = {

    recog: function(message){

        var messageReceived = message.content.split(" ");

        switch(messageReceived[0]){

            case '!plRegister':

                createRegister(message.author.id, message);
                break;
            
            case '!plAdd':

                addPlaylist(message.author.id, messageReceived, message);
                break;

            case '!plAddSong':
                
                addSongToPl(message.author.id, messageReceived, message);
                break;

            case '!plPlay':

                play(message.author.id, messageReceived, message);
                break;

            case '!plSkip':
                skip();
                break;

        }
    }

}

function createRegister(id, message){

    suda.Suda.find({userID: id}, function(err, data){
        
        if(data.length == 0){    
            
            var user = new suda.Suda({userID: id, musics: []});
               
            user.save((err)=>{
            
                if(err) throw err;
            
                     message.reply(" you have been registered!");
            
                })
                
                }else{
            
                    message.reply(" you have already been registered!");
        }
        
    });

}

function addPlaylist(id, message, author){

    if(message.length === 2){

        suda.Suda.update({userID: id}, {$push : {musics: {plName: message[1], music: [] }}}, function(err){

            if(err) throw err;
        
        });

        author.reply(" your playlist has been created!");

    }else{

        author.reply(" you should include a name. For example !plAdd name");

    }
}

function play(id, messageReceived, message){

    suda.Suda.find({userID: id}, function (err, data) {

       var elementMusics;

       data[0].musics.forEach(function(element) {

            if(element.plName === messageReceived[1]) elementMusics = element.music;
           
       }, this)

       if(message.member != undefined && elementMusics != undefined){

            if(!message.member.voiceChannel) message.reply(" you must be in a voice channel!");

                playMusic(elementMusics, message);
       }
    }
  );
}

function playMusic(audio, message){
        
    const voiceChannel = message.member.voiceChannel;
       
    voiceChannel.join().then(connnection => {
        
        const stream = ytdl(audio[0], { filter: 'audioonly' });

        dispatcher = connnection.playStream(stream);
            
        dispatcher.on('end', () => {
          
            audio.shift();
        
            if(audio.length == 0){
        
                voiceChannel.leave()
        
            }else{
        
                playMusic(audio, message);
            }
                  
        });
    });
}

function addSongToPl(id, message, author){

    if(message.length === 3){

        suda.Suda.update({'musics.plName': message[1]}, {'$push' : {'musics.$.music' : message[2] }}, 
            function(callback){

                })
        
        author.reply(`your song  has been added to ${message[1]}!`);
                

        }else{
        
            author.reply(" you should include your playlist name and the url of the song to be added. For example ");
        
        }

}

function skip(){

    dispatcher.end();
}








