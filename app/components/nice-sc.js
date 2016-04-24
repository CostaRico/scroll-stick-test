import Ember from 'ember';
import _ from 'underscore';
function l(e) {
  console.log(e);
}

export default Ember.Component.extend({
  classNames: ['nice-sc'],
  heights: [],
  baseItem: 0,
  data: function () {
    var res = [];
    for (var g = 0; g < 300; g++) {
      var group = {
        data: {
          name: 'name' + g,
          id: 'id#' + g
        },
        items: []
      };
      for (var i = 0; i < _.random(2, 50); i++) {
        group.items.push({
          name: 'name' + i,
          lastName: 'lastName' + i,
          middName: 'middName' + i,
        });
      }
      res.push(group);
    }
    return res;
  }.property(),

  visible: function () {
    var bi = this.get('baseItem');
    return this.get('data').slice(0+bi, 10+bi);
  }.property('data', 'baseItem'),


  elHeight: 50,
  getActiveItem: function (currST) {
    var r = 1;
   // l(this.offsets);

    var summ = 0;
    for (var i = 0; i < this.heights.length; i++) {
      var currH = this.heights[i];
      var prevEl = 0;
      if(this.heights[i-1]){
        prevEl = this.heights[i-1];
      }

      summ = summ+this.heights[i];
      //l('CurrST: '+currST + ' Prev height: ' + prevEl + ' CurrHeight: ' + currH);
      if(currST >= (summ-currH) && currST < summ){
        r = i;
        break;
      }
    }
    return r+1;
  },
  calcHeights(){
    this.heights = [];
    _.each(this.$('div.group'), el=>{
      this.heights.push($(el).outerHeight());
    });
  },
  setLimits(AI){
    var bi = this.get('baseItem');
    if(AI==8 && this.lastAI < 8){
      this.set('baseItem', bi+3);
      Ember.run.next(()=>{
        this.calcHeights();
        var newMargin = 0;
        this.$('.group').slice(0,4).each((i, el)=> {
          newMargin = newMargin + $(el).height();
        });
        this.get('cont').scrollTop( newMargin );
      });
    }

    if(AI==2 && this.lastAI>2){
      if(bi-2 >= 0){
        this.set('baseItem', bi-2);
        Ember.run.next(()=>{
          this.calcHeights();
          var newMargin = 0;
          this.$('.group').slice(0,4).each((i, el)=> {
            newMargin = newMargin + $(el).height();
          });
          this.get('cont').scrollTop( newMargin );
        });
      }else{
        this.set('baseItem', 0);
      }


    }
  },
  didInsertElement(){
    this._super(arguments);
    this.set('cont', this.$('div.sc-container'));
    this.calcHeights();


    this.get('cont').scroll((ev)=> {

      Em.run.debounce(this, ()=> {
        this.onScroll(ev);
      }, 30, true);
    }).trigger('scroll');
  },

  elMargin: '0px',
  scrollTop: 0,
  lastAI: false,
  onScroll(ev){
    var AI = this.getActiveItem(ev.target.scrollTop);
    this.scrollTop = ev.target.scrollTop;
    //l('Current AI: '+AI );
    if(this.lastAI!=AI){
      this.$('div.group-info').removeClass('curr');
      this.$('div.group').eq(AI-1).find('div.group-info').addClass('curr');
    }
    if(AI==2 || AI ==8 ){
      //rerender items
      this.setLimits(AI);
      //resetAI
    }
    this.lastAI = AI;

  }

});
