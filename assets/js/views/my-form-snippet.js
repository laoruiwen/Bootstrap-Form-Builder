define([
    "jquery", "underscore", "backbone",
    "views/snippet", "views/temp-snippet",
    "helper/pubsub"
], function ($, _, Backbone,
             SnippetView, TempSnippetView,
             PubSub) {
    //你的表单下的组件
    return SnippetView.extend({
        events: {
            "click": "preventPropagation", //stops checkbox / radio reacting.
            "mousedown": "mouseDownHandler",    //鼠标点击
            "mouseup": "mouseUpHandler"         //鼠标放开
        },
        //鼠标点击你的表单下的组件
        mouseDownHandler: function (mouseDownEvent) {
            //阻止冒泡&阻止默认事件
            this.preventPropagation(mouseDownEvent);
            var that = this;

            //popover
            $(".popover").remove();
            //打开表单属性编辑
            this.$el.popover("show");
            //保存、取消按钮事件
            $(".popover #save").on("click", this.saveHandler(that));
            $(".popover #cancel").on("click", this.cancelHandler(that));
            //add drag event for all but form name
            if (this.model.get("title") !== "Form Name") {
                $("body").on("mousemove", function (mouseMoveEvent) {
                    if (
                        Math.abs(mouseDownEvent.pageX - mouseMoveEvent.pageX) > 10 ||
                        Math.abs(mouseDownEvent.pageY - mouseMoveEvent.pageY) > 10
                    ) {
                        that.$el.popover('destroy');
                        //放入临时组件到body中
                        PubSub.trigger("mySnippetDrag", mouseDownEvent, that.model);
                        that.mouseUpHandler();
                    }
                });
            }
        },
        //阻止冒泡&阻止默认事件
        preventPropagation: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        //鼠标放开你的表单下的组件
        mouseUpHandler: function (mouseUpEvent) {
            $("body").off("mousemove");
        },
        saveHandler: function (boundContext) {
            return function (mouseEvent) {
                mouseEvent.preventDefault();
                var fields = $(".popover .field");
                _.each(fields, function (e) {

                    var $e = $(e)
                        , type = $e.attr("data-type")
                        , name = $e.attr("id");

                    switch (type) {
                        case "checkbox":
                            boundContext.model.setField(name, $e.is(":checked"));
                            break;
                        case "input":
                            boundContext.model.setField(name, $e.val());
                            break;
                        case "textarea":
                            boundContext.model.setField(name, $e.val());
                            break;
                        case "textarea-split":
                            boundContext.model.setField(name,
                                _.chain($e.val().split("\n"))
                                    .map(function (t) {
                                        return $.trim(t)
                                    })
                                    .filter(function (t) {
                                        return t.length > 0
                                    })
                                    .value()
                            );
                            break;
                        case "select":
                            var valarr = _.map($e.find("option"), function (e) {
                                return {value: e.value, selected: e.selected, label: $(e).text()};
                            });
                            boundContext.model.setField(name, valarr);
                            break;
                    }
                });
                boundContext.model.trigger("change");
                $(".popover").remove();
            }
        },
        cancelHandler: function (boundContext) {
            return function (mouseEvent) {
                mouseEvent.preventDefault();
                $(".popover").remove();
                boundContext.model.trigger("change");
            }
        }
    });
});
