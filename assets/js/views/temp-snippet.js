define([
    "jquery"
    , "views/snippet"
    , "text!templates/app/temp.html"
    , "helper/pubsub"
], function ($
    , SnippetView
    , _tempTemplate
    , PubSub) {
    //临时组件
    return SnippetView.extend({
        initialize: function () {
            //渲染临时组件
            PubSub.on("newTempPostRender", this.postRender, this);
            this.constructor.__super__.initialize.call(this);
            this.tempTemplate = _.template(_tempTemplate);
        },
        className: "temp",
        render: function () {
            return this.$el.html(this.tempTemplate({text: this.constructor.__super__.render.call(this).html()}));
        },
        postRender: function (mouseEvent) {
            this.tempForm = this.$el.find("form")[0];   //temp下的form
            this.halfHeight = Math.floor(this.tempForm.clientHeight / 2);
            this.halfWidth = Math.floor(this.tempForm.clientWidth / 2);
            //临时组件跟随鼠标移动
            this.centerOnEvent(mouseEvent);
        },
        events: {
            "mousemove": "mouseMoveHandler",    //鼠标移动事件
            "mouseup": "mouseUpHandler"     //鼠标放开事件
        },
        //临时组件跟随鼠标移动
        centerOnEvent: function (mouseEvent) {
            var mouseX = mouseEvent.pageX;
            var mouseY = mouseEvent.pageY;
            this.tempForm.style.top = (mouseY - this.halfHeight) + "px";
            this.tempForm.style.left = (mouseX - this.halfWidth) + "px";
            // Make sure the element has been drawn and
            // has height in the dom before triggering.
            //临时组件移动
            PubSub.trigger("tempMove", mouseEvent);
        },
        //临时组件跟随鼠标移动
        mouseMoveHandler: function (mouseEvent) {
            mouseEvent.preventDefault();
            //临时组件跟随鼠标移动
            this.centerOnEvent(mouseEvent);
        },
        //鼠标放开临时组件事件
        mouseUpHandler: function (mouseEvent) {
            mouseEvent.preventDefault();
            PubSub.trigger("tempDrop", mouseEvent, this.model);
            //销毁临时组件
            this.remove();
        }
    });
});
