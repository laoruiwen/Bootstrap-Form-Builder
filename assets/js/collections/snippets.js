define([
       "jquery" , "underscore" , "backbone"
       , "models/snippet"
       , "views/tab-snippet"
], function(
  $, _, Backbone
  , SnippetModel
  , TabSnippetView
){
    //
  return Backbone.Collection.extend({
    model: SnippetModel
      //渲染全部组件
    , renderAll: function(){
      return this.map(function(snippet){
          //返回jquery对象$component
          //snippet为modal
        return new TabSnippetView({model: snippet}).render();
      });
    }
  });
});
