define([
    "jquery", "underscore", "backbone"
    , "views/temp-snippet"
    , "helper/pubsub"
    , "text!templates/app/renderform.html"
], function ($, _, Backbone
    , TempSnippetView
    , PubSub
    , _renderForm) {
    //你的表单
    return Backbone.View.extend({
        tagName: "fieldset",
        initialize: function () {
            //给collection添加一个model的时候，如果绑定了collection的add事件，那么该事件的回调函数会接收三个参数。
            //第一个参数是：当前被add到collection的model对象；
            //第二个参数是：当前collection对象。
            //第三个参数是可选项，具体是什么官方也没有介绍。
            this.collection.on("add", this.render, this);
            this.collection.on("remove", this.render, this);
            this.collection.on("change", this.render, this);

            //放入临时组件到body中
            PubSub.on("mySnippetDrag", this.handleSnippetDrag, this);
            //组件跟随鼠标移动
            PubSub.on("tempMove", this.handleTempMove, this);
            //鼠标放开临时组件事件
            PubSub.on("tempDrop", this.handleTempDrop, this);
            this.$build = $("#build");      //你的表单
            this.renderForm = _.template(_renderForm);
            this.render();
        },
        render: function () {
            //Render Snippet Views
            this.$el.empty();
            var that = this;
            _.each(this.collection.renderAll(), function (snippet) {
                that.$el.append(snippet);
            });
            $("#render").val(that.renderForm({
                multipart: this.collection.containsFileType(),
                text: _.map(this.collection.renderAllClean(), function (e) {
                    return e.html()
                }).join("\n")
            }));
            this.$el.appendTo("#build form");
            this.delegateEvents();
        },
        //找到目标组件
        getBottomAbove: function (eventY) {
            var myFormBits = $(this.$el.find(".component"));
            var topelement = _.find(myFormBits, function (renderedSnippet) {
                return ($(renderedSnippet).position().top + $(renderedSnippet).height()) > eventY - 90;
            });
            if (topelement) {
                return topelement;
            } else {
                return myFormBits[0];
            }
        },
        //放入临时组件到body中
        handleSnippetDrag: function (mouseEvent, snippetModel) {
            $("body").append(new TempSnippetView({model: snippetModel}).render());
            this.collection.remove(snippetModel);
            PubSub.trigger("newTempPostRender", mouseEvent);
        },
        //组件移动到你的表单之上，表单的动作，组件插入在.target组件之下
        handleTempMove: function (mouseEvent) {
            $(".target").removeClass("target");
            //判断是否在你的表单区域
            if (this.isInBulid(mouseEvent)) {
                //找到目标组件，加上class target
                $(this.getBottomAbove(mouseEvent.pageY)).addClass("target");
            }
        },
        //把临时组件放入你的表单中
        handleTempDrop: function (mouseEvent, model) {
            var $target = $(".target");
            $target.removeClass("target");
            //判断是否在你的表单区域
            if (this.isInBulid(mouseEvent)) {
                //得到目标组件的序号
                var index = $target.index();
                //把modal加入collection
                this.collection.add(model, {at: index + 1});
            }
        },
        //判断是否在你的表单区域
        isInBulid : function (mouseEvent) {
            return mouseEvent.pageX >= this.$build.position().left &&
            mouseEvent.pageX < (this.$build.width() + this.$build.position().left) &&
            mouseEvent.pageY >= this.$build.position().top &&
            mouseEvent.pageY < (this.$build.height() + this.$build.position().top)
        }
    })
});
