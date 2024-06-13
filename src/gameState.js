import { DAY_LENGTH, NIGHT_LENGTH, RAIN_CHANCE, SCENES, getNextDieTime, getNextHungerTime, getNextPoopTime } from "./constants";
import { modFox, modScene, togglePoopBag, writeModal } from "./ui";


const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  sleepTime: -1,
  hungryTime: -1,
  dieTime: -1,
  timeToStartCelebrating: -1,
  timeToStopCelebrating: -1,
  poopTime: -1,
  tick(){
    this.clock++;
    // console.error('clock', this.clock);

    if (this.clock === this.wakeTime) {
      this.wake();
    }
    else if (this.clock === this.sleepTime) {
      this.sleep();
    }
    else if (this.clock === this.hungryTime) {
      this.getHungry();
    }
    else if (this.clock === this.dieTime) {
      this.die();
    }
    else if (this.clock === this.timeToStartCelebrating) {
      this.startCelebrating();
    }
    else if (this.clock === this.timeToStopCelebrating) {
      this.endCelebrating();
    }
    else if (this.clock === this.poopTime) {
      this.poop();
    }

    return this.clock;
  },

  startGame(){
    this.current = 'HATCHING';
    this.wakeTime = this.clock + 3;
    modFox('egg');
    modScene('day');
    writeModal();
  },

  wake() {
    this.current = 'IDLING';
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
    writeModal("I'M ALIVE!");
    setTimeout(writeModal, 3000);
  },

  sleep() {
    this.state = "SLEEP";
    modFox('sleep');
    modScene('night');
    this.clearTimes();
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },

  clearTimes() {
  this.clock = -1
  this.wakeTime = -1
  this.sleepTime = -1
  this.hungryTime = -1
  this.dieTime = -1
  this.timeToStartCelebrating = -1
  this.timeToStopCelebrating = -1
  this.poopTime = -1
  },

  getHungry() {
    this.current = 'HUNGRY';
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    modFox('hungry');
    writeModal("I'm Hungry Emery. Can I have some food please?")
  },

  die() {
    this.current = 'DEAD',
    modScene('dead');
    modFox('dead');
    this.clearTimes();
    writeModal(`Oh no Emery!! The fox died :,( <br/> Press the middle button to start a new game.`)
  },

  startCelebrating() {
    writeModal();
    this.current = 'CELEBRATING';
    modFox('celebrate');
    this.timeToStartCelebrating = -1;
    this.timeToStopCelebrating = this.clock + 2;
  },

  endCelebrating() {
    this.timeToStopCelebrating = -1;
    this.current = 'IDLING';
    this.determineFoxState();
    togglePoopBag(false);
  },

  determineFoxState() {
    if (this.current === 'IDLING') {
      if (SCENES[this.scene] === 'rain') {
        modFox('rain');
      }
      else {
        modFox('idling')
      }
    }
  },

  poop() {
    this.current = 'POOP';
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox('pooping');
  },

  handleUserAction(icon) {
    if(
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      // do nothing
      return;
    }

    if(this.current === 'INIT' || this.current === 'DEAD') {
      this.startGame();
      return;
    }

    switch(icon){
      case 'weather':
        this.changeWeather();
        break;
      case 'poop':
        this.cleanUpPoop()
        break;
      case 'fish':
        this.feed();
        break;
    }
  },
  changeWeather() {
    this.scene = (this.scene + 1) % SCENES.length;
    modScene(SCENES[this.scene]);
    this.determineFoxState();
  },

  cleanUpPoop() {
    if (!this.current === 'POOPING') {

      return;
    }

    this.dieTime = -1;
    togglePoopBag(true);
    this.startCelebrating();
    this.hungryTime = getNextHungerTime(this.clock);
  },

  feed() {
    if (this.current !== 'HUNGRY') {
      return;
    }
    this.current = 'FEEDING';
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox('eating');
    this.timeToStartCelebrating = this.clock + 2;
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
