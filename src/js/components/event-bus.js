import Events from 'event-pubsub';

let EventBus = new Events;

var EventTag = {
  playEvent: 'playEvent',
  TXUpdate: 'TXUpdate',
  countUpdate: 'countUpdate',
  dxsUpdate: 'dxsUpdate',
  callPlay: 'callPlay',
  ConnectionUpdate: 'ConnectionUpdate',
  AccountUpdate: 'AccountUpdate',
  dog: 'dog',

}
EventBus.tag = EventTag;

// call EventBus.tag.callPlay

EventBus.on(
    EventBus.tag.dog,
    function(data){
        console.log('DOG SAYS: ', data.msg);
        var audio = new Audio('https://ethereumtower.000webhostapp.com/dog.mp3');
        audio.play();
    }
);

export default EventBus;
