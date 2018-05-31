define([
       "jquery", "underscore", "backbone"
       , "models/snippet"
       , "views/snippet", "views/temp-snippet"
       , "helper/pubsub"
], function(
  $, _, Backbone
  , SnippetModel
  , SnippetView, TempSnippetView
  , PubSub
){
    //tab下的组件
  return SnippetView.extend({
    events:{
      "mousedown" : "mouseDownHandler"
    }
    //组件mousedown事件
    , mouseDownHandler: function(mouseDownEvent){
      mouseDownEvent.preventDefault();
      mouseDownEvent.stopPropagation();
      //hide all popovers
      $(".popover").hide();
      $("body").append(
          new TempSnippetView({
              model: new SnippetModel(
                  $.extend(true,{},this.model.attributes)
              )
          }).render()
      );
          //渲染临时组件
      PubSub.trigger("newTempPostRender", mouseDownEvent);
    }
  });
});
