/**
 * 对话框组件 v1.0
 * @param    jquery
 * @Author   ck_email@163.com
 * @DateTime 2016-09-20T10:38:04+0800
 */
(function($){
	$.fn.calldialog = function(options){
		var options = $.extend({}, $.fn.calldialog.defaults, options);
        var dom = this;
        var body = $("body");
        var windowx = $(window).width();
        var windowy = $(window).height();
        var domx = options.width;   //记录弹出窗口的宽度；
        var domy = options.height;  //记录弹出窗口的高度；
        //控制显示提示框
        function showdialogue(){
            options.beforeCall();   //先执行前置函数。
            var mdom = $(getDomMethod());
            body.append(mdom);    //添加dom元素到窗口中；
            var _dialog = mdom.last(); //取后面的元素为对话框
            domx = _dialog.width();    //重置弹出框的宽度；
            domy = _dialog.height();   //重置弹出框的高度；
            var inity = bodyScrolls().y + windowy - domy - 2;     //起始动画top值。（对话框停留在窗口底部时的top值）
            if(options.needSlow){   //判断是需要添加缓动进入离开事件
                var postion = absolutemiddle();
                _dialog.offset({left:postion.left,top:inity});
                dialogueIn(_dialog,postion);
            }else{
                _dialog.offset(absolutemiddle());  //控制弹出窗口居中。
            }
            if(options.overCancel){     //判断是否需要添加点击其它区域关闭弹出窗口事件
                body.find(".ck-cover").on("click",function(e){
                    if(options.needSlow){dialogueOut(_dialog,inity);}
                    else{body.find(".ck-cover,.ck-dialogue").remove();}
                });
            }
            if(options.allCancel){     //判断是否需要添加点击屏幕区域关闭弹出窗口事件
                body.find(".ck-cover,.ck-dialogue").on("click",function(e){
                    if(options.needSlow){dialogueOut(_dialog,inity);}
                    else{body.find(".ck-cover,.ck-dialogue").remove();}
                });
            }
            var cancelbtn = _dialog.find(".dialogue-bottom .ck-cancel");
            if(cancelbtn.length>0){     //判断当关闭按钮存在则绑定关闭事件
                cancelbtn.on("click",function(e){
                    if(options.needSlow){dialogueOut(_dialog,inity);}
                    else{body.find(".ck-cover,.ck-dialogue").remove();}
                });
            }
            var closeimage = _dialog.find(".ck-close");
            if(closeimage.length>0) {   //判断当关闭图片存在则绑定关闭事件
                closeimage.on("click",function(e){
                    if(options.needSlow){dialogueOut(_dialog,inity);}
                    else{body.find(".ck-cover,.ck-dialogue").remove();}
                });
            }
            resizeControlAction(_dialog);   //随窗口大小变化动态更新窗口大小值。
            if(options.isDrag){_dialog.find(".dialogue-title").css("cursor","move");titleDrag(_dialog);}   //判断是否需要添加拖动
            if(options.autoClear){autoClearControl(_dialog,inity);}     //判断是否需要添加自动消失效果。
            _dialog.find("*[type=button]").on("click",function(e){ //为对话框中的所有按钮添加监听事件
                if(options.btnClick(this)){     //e.target
                    dialogueOut(_dialog,inity); //关闭对话框
                }
            });
            options.afterCall(_dialog);	//弹出窗口之后执行。
        }
        //拼接弹出框DOM字符串
        function getDomMethod(){
            var coverstr = "<div class='ck-cover "+(options.cssVersion?"ck-cover"+options.cssVersion:"")+" "+(options.needSlow?"":"ck-fadein")+"'></div>";
            var imgstr = "<a class='ck-close "+(options.cssVersion?"ck-close"+options.cssVersion:"")+"'></a>";
            imgstr = options.closeImage?imgstr:"";
            var titlestr = "<div class='dialogue-title "+(options.cssVersion?"dialogue-title"+options.cssVersion:"")+"' style='width:"+options.width
                            +"px;' onmousedown='return false' onselectstart='return false'>"+options.titleContent+imgstr+"</div>";
            titlestr = options.titleShow?titlestr:"";   //判断标题栏是否需要显示；
            var conh = options.conHeight?"height:"+options.conHeight+"px;overflow-y:auto;":"";
            var conw = options.conWidth?"width:"+options.conWidth+"px;":"";
            var contentstr = "<div class='dialogue-about "+(options.cssVersion?"dialogue-about"+options.cssVersion:"")+"' style='"+conw+conh+"'>"+options.content+"</div>";
            var bottomstr = "";
            if(options.closeButton){
                bottomstr += "<button type='button' class='ck-btn ck-cancel' >关闭</button>";
            }
            bottomstr = "<div class='dialogue-bottom "+(options.cssVersion?"dialogue-bottom"+options.cssVersion:"")+"'>"+options.bottomContent+bottomstr+"</div>";
            bottomstr = options.bottomShow?bottomstr:"";
            var dialogStr = coverstr+"<div class='ck-dialogue "+(options.cssVersion?"ck-dialogue"+options.cssVersion:"")+"' style='width:"+
                            options.width+"px;min-height:"+
                            options.height+"px;"+(options.needSlow?"opacity:0;":"")+"'>"+
                            titlestr+contentstr+bottomstr+"</div>";
            return dialogStr;
        }
        //根据页面窗口宽高调整left和right使absolute标签上下左右居中
        function absolutemiddle(){
            windowx = $(window).width();
            windowy = $(window).height();
            var left_num = (windowx-domx)/2 + bodyScrolls().x;
            var top_num = (windowy-domy)/2 + bodyScrolls().y;
            var newPos = new Object();
            newPos.left = left_num;newPos.top = top_num;
            return newPos;
        }
        //随着窗口调整动态更新窗口的宽度和高度值。
        function resizeControlAction(tdom){
            $(window).resize(function(){
                windowx = $(window).width();
                windowy = $(window).height();
                if(options.resizeControl){     //判断是否需要动态调整窗口居中。
                    var left_num = (windowx-domx)/2 + bodyScrolls().x;
                    var top_num = (windowy-domy)/2 + bodyScrolls().y;
                    tdom.offset({left:left_num,top:top_num});
                }
            });
        }
        //判断是否需要给元素绑定事件，否则直接弹出对话框。
        if(options.mothed){
            $(dom).on(options.mothed,function(e){
                showdialogue();
            });
        }else{
            showdialogue();     //未指定事件的直接弹出对话框。
        }
        //标题栏拖动事件。
        var ismove = false;     //拖动标记
        function titleDrag(tdom){
            var titledom = tdom.find(".dialogue-title");
            if(titledom.length==0) return;
            var downx = "";var downy = "";  //记录在标题栏点击处的x、y坐标。
            var domleft = "";var domtop = "";   //记录标题栏距离窗口的左边距和上边距。
            var middlepos = {left:tdom.offset().left,top:tdom.offset().top};    //记录下窗口初始进入left和top值
            titledom.mousedown(function(){
                ismove = true;
                downx = mouseMove().x;
                downy = mouseMove().y;
                var bodyScorll = bodyScrolls();
                domleft = tdom.offset().left;
                domleft += (domleft==middlepos.left?bodyScorll.x:0);
                domtop = tdom.offset().top;
                domtop += (domtop==middlepos.top?bodyScorll.y:0);
            });
            $(document).mousemove(function(){
                var x = mouseMove().x;var y = mouseMove().y;
                $(document).mouseup(function(){ismove = false;});
                if(ismove){
                    var livex = x - (downx - domleft);  //left = x坐标 - (起始x - 起始左边距)
                    var livey = y - (downy - domtop);   //top = y坐标 - (起始y - 起始上边距)
                    if(domx>windowx){livex = domleft;}  //当弹出窗口宽度大于浏览器窗口宽度，左边距取原来居中值
                    else{
                        var xmax = bodyScrolls().x + windowx - domx - 2;      //最大右移值-偏差（border宽度）
                        var xmin = bodyScrolls().x;
                        livex = livex<0?0:livex;
                        livex = livex>xmax?xmax:livex;
                    }
                    if(domy>windowy){livey = domtop;}   //当弹出窗口高度大于浏览器窗口高度，上边距取原来居中值
                    else{
                        var ymax = bodyScrolls().y + windowy - domy - 2;    //最大下移值-偏差（border高度）
                        var ymin = bodyScrolls().y;
                        livey = livey<ymin?ymin:livey;
                        livey = livey>ymax?ymax:livey;
                    }
                    tdom.offset({left:livex,top:livey});
                }
            });
        }
        //自动消失控制事件
        var clearTime = "";
        function autoClearControl(tdom,inity){
            clearTimeout(clearTime);
            clearTime = setTimeout(function(){
                dialogueOut(tdom,inity);
            },options.autoClearTime);
            tdom.hover(function(){
                clearTimeout(clearTime);
            },function(){
                clearTime = setTimeout(function(){
                    dialogueOut(tdom,inity);
                },1000);
            });
        }
        //打开对话框动画
        function dialogueIn(tdom,position){
            var coverdom = tdom.prev();
            coverdom.animate({opacity:0.5},500,function(){
                $(this).addClass("ck-fadein");
            });
            tdom.animate({opacity:1,top:position.top},300,function(){});
        }
        //关闭对话框动画
        function dialogueOut(tdom,inity){
            var coverdom = tdom.prev();
            tdom.animate({opacity:0,top:inity},300,function(){
                $(this).remove();
            });
            coverdom.animate({opacity:0},500,function(){
                $(this).remove();
                options.callBack();
            });
        }

        /*------------------工具方法--------------------*/
        /*鼠标坐标获取*/
        function mouseMove(ev){ 
            ev = arguments.callee.caller.arguments[0] || window.event; 
            var mousePos = mouseCoords(ev); 
            return mousePos;
        } 
        function mouseCoords(ev) { 
            if(ev.pageX || ev.pageY){ 
                //Firefox
                return {x:ev.clientX, y:ev.clientY}; 
            }
            //IE
            return {
                x:ev.clientX+document.documentElement.scrollLeft,
                y:ev.clientY+document.documentElement.scrollTop
            }; 
        }
        /*计算窗口的移动位置x,y*/
        function bodyScrolls(){
            var fx = window.pageXOffset  
                || document.documentElement.scrollLeft  
                || document.body.scrollLeft  
                || 0;
            var fy = window.pageYOffset  
                || document.documentElement.scrollTop  
                || document.body.scrollTop  
                || 0;
            return {x:fx,y:fy};
        }
    };

	//控件默认值
    $.fn.calldialog.defaults = {
    	mothed: null,	    //是否不绑定事件直接显示对话框(false or String)
        titleShow: true,    //是否显示对话框的标题栏
        bottomShow: true,   //是否显示底部选项栏目。
        closeImage: true,   //是否使用关闭图片。
        closeButton: false,  //是否使用关闭按钮。
        titleContent: "<strong>提示</strong>", //提示标题内容。
        content: "<p>提示内容!</p>", //提示区域内容，支持Dom元素扩展。
        bottomContent: "",  //底部区域内容。
        width: 500,         //对话框的宽度。
        height: 170,        //对话框的高度。
        conHeight:null,		//设置对话框内容部分的高度。
        conWidth:null,		//设置对话框内容部分的宽度。
        autoClear: false,   //设置是否自动消失。
        autoClearTime: 1500, //设置自动消失时长。默认1.5s
        isDrag: true,       //是否可拖动。
        cssVersion: null,     //设置css主题值，用于支持样式扩展。
        needSlow: true,     //设置是否需要缓动进入和离开。
        overCancel: false,  //点击提示框外的区域是否可关闭提示框。
        allCancel: false,	//再次点击窗口及以外区域是否可关闭提示框。
        resizeControl: true, //是否跟随窗口大小改变调整窗口居中。
        beforeCall: function(){},    //弹出对话框前执行函数。
        afterCall: function(dom){},	//弹出对话框之后执行函数。dom为对话框本身。
        callBack: function(){},     //对话框关闭后执行函数。
        btnClick: function(elem){}     //对话框中的按钮点击触发事件。elem为触发事件的DOM元素，函数返回值为true时关闭对话框。false不关闭
    }
})(jQuery);
