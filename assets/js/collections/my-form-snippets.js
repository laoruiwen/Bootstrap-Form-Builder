define([
    "jquery", "underscore", "backbone"
    , "models/snippet"
    , "views/my-form-snippet"
], function ($, _, Backbone
    , SnippetModel
    , MyFormSnippetView) {
    //你的表单Collection
    return Backbone.Collection.extend({
        model: SnippetModel,
        initialize: function () {
            this.counter = {};
            //给collection添加一个model的时候，如果绑定了collection的add事件，那么该事件的回调函数会接收三个参数。
            //第一个参数是：当前被add到collection的model对象；
            //第二个参数是：当前collection对象。
            //第三个参数是可选项，具体是什么官方也没有介绍。
            this.on("add", this.giveUniqueId);
        },
        //给modal不同的id
        giveUniqueId: function (snippet) {
            if (!snippet.get("fresh")) {
                return;
            }
            snippet.set("fresh", false);
            var snippetType = snippet.attributes.fields.id.value;

            if (typeof this.counter[snippetType] === "undefined") {
                this.counter[snippetType] = 0;
            } else {
                this.counter[snippetType] += 1;
            }

            snippet.setField("id", snippetType + "-" + this.counter[snippetType]);

            if (typeof snippet.get("fields")["id2"] !== "undefined") {
                snippet.setField("id2", snippetType + "2-" + this.counter[snippetType]);
            }
        },
        containsFileType: function () {
            return !(typeof this.find(function (snippet) {
                return snippet.attributes.title === "File Button"
            }) === "undefined");
        },
        renderAll: function () {
            return this.map(function (snippet) {
                return new MyFormSnippetView({model: snippet}).render(true);
            })
        },
        renderAllClean: function () {
            return this.map(function (snippet) {
                return new MyFormSnippetView({model: snippet}).render(false);
            });
        }
    });
});
