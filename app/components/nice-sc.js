import Ember from 'ember';

export default Ember.Component.extend({
  data: function () {
    var res = [];
    for (var g = 0; g < 20; g++) {
      var group = {
        data: {
          name: 'name'+g,
          id: 'id#'+g
        },
        items: []
      };
      for (var i = 0; i < 30; i++) {
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
  onScroll(ev){
    Em.run.debounce(this, ()=>{
      var scrollVal  =ev.target.scrollTop;
      var summ = 0;
      this.$('div.group').each((i, item)=>{
        //var itemOffset = item.offsetTop;//отступ сверху контейнера
        var $item = $(item);
        var itemHeight = $item.height();

        summ += itemHeight;

        if(scrollVal <  summ && 0 < (scrollVal-itemHeight)){
          $('div.group-info').removeClass('curr');
          $('div.group').css('padding-top', '0');

          $(item).find('.group-info').addClass('curr');
          $(item).css('padding-top', '39px;');
          console.log('======================================');
          console.log('index: '+i);
          console.log('Высота элемента:'+itemHeight);
          console.log('Сумма высот элементов:'+summ);
          console.log('Прокручено'+scrollVal);
          console.log('======================================');
          return false;
        }
      });

      //console.log('==================');
      //console.log($(ev.target).offset().top);
    }, 150, true);
  },
  didInsertElement(){
    this.$('.sc-container').scroll((ev)=>{
      this.onScroll(ev);
    });
    //window.addEventListener('scroll', this.onScroll, false);
  }

});
