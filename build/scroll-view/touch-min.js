/*
Copyright 2014, KISSY v1.50
MIT Licensed
build time: Mar 5 22:12
*/
KISSY.add("scroll-view/touch",["./base","node","anim"],function(t,u){function w(b,d,a){if(!x(b,a)){var c=b.startScroll[a]-("left"===a?d.deltaX:d.deltaY),d=b.minScroll,f=b.maxScroll;b._bounce||(c=Math.min(Math.max(c,d[a]),f[a]));c<d[a]?(c=d[a]-c,c*=y,c=d[a]-c):c>f[a]&&(c-=f[a],c*=y,c=f[a]+c);b.set("scroll"+t.ucfirst(a),c)}}function x(b,d){return!b.allowScroll[d]&&b["_"+("left"===d?"lockX":"lockY")]?1:0}function z(b,d,a,c){if(x(b,a))c();else{var f="scroll"+t.ucfirst(a),e=b.get(f),i=b.minScroll,k=b.maxScroll,
j;e<i[a]?j=i[a]:e>k[a]&&(j=k[a]);void 0!==j?(e={},e[a]=j,b.scrollTo(e,{duration:b.get("bounceDuration"),easing:b.get("bounceEasing"),queue:!1,complete:c})):b.pagesOffset?c():(j="left"===a?-d.velocityX:-d.velocityY,j=Math.min(Math.max(j,-A),A),c={node:{},to:{},duration:9999,queue:!1,complete:c,frame:E(b,j,e,f,k[a],i[a])},c.node[a]=e,c.to[a]=null,b.scrollAnims.push((new F(c)).run()))}}function E(b,d,a,c,f,e){var i=d*v,k=1,j=0;return function(d,s){var g=t.now(),h;if(k){h=g-d.startTime;var l=Math.exp(h*
G);h=parseInt(a+i*(1-l)/-B,10);h>e&&h<f?s.lastValue===h?s.pos=1:(s.lastValue=h,b.set(c,h)):(k=0,i*=l,a=h<=e?e:f,j=g)}else h=g-j,g=h/v,g*=Math.exp(-H*g),h=parseInt(i*g,10),0===h&&(s.pos=1),b.set(c,a+h)}}function I(b){if(b.isTouch&&!(this.get("disabled")||this.isScrolling&&this.pagesOffset))this.startScroll={},this.dragInitDirection=null,this.isScrolling=1,this.startScroll.left=this.get("scrollLeft"),this.startScroll.top=this.get("scrollTop"),this.$contentEl.on("drag",C,this).on("dragEnd",D,this)}function D(b){this.$contentEl.detach("drag",
C,this).detach("dragEnd",D,this);this.isScrolling&&this.fire("touchEnd",{pageX:b.pageX,deltaX:b.deltaX,deltaY:b.deltaY,pageY:b.pageY,velocityX:b.velocityX,velocityY:b.velocityY})}function J(b){function d(){c++;if(2===c){var d=function(){a.isScrolling=0;a.fire("scrollTouchEnd",{pageX:b.pageX,pageY:b.pageY,deltaX:-f,deltaY:-e,fromPageIndex:h,pageIndex:a.get("pageIndex")})};if(a.pagesOffset){var i=a._snapDurationCfg,g=a._snapEasingCfg,h=a.get("pageIndex"),l=a.get("scrollLeft"),o=a.get("scrollTop"),i=
{duration:i,easing:g,complete:d},q=a.pagesOffset,n=q.length;a.isScrolling=0;if(k||j)if(k&&j){var g=[],m,p;for(m=0;m<n;m++){var r=q[m];r&&(0<f&&r.left>l?g.push(r):0>f&&r.left<l&&g.push(r))}q=g.length;if(0<e){l=Number.MAX_VALUE;for(m=0;m<q;m++)n=g[m],n.top>o&&l<n.top-o&&(l=n.top-o,p=g.index)}else{l=Number.MAX_VALUE;for(m=0;m<q;m++)n=g[m],n.top<o&&l<o-n.top&&(l=o-n.top,p=g.index)}void 0!==p?p!==h?a.scrollToPage(p,i):(a.scrollToPage(p),d()):d()}else k||j?(d=a.getPageIndexFromXY(k?l:o,k,k?f:e),a.scrollToPage(d,
i)):(a.scrollToPage(h),d())}else d()}}var a=this,c=0,f=-b.deltaX,e=-b.deltaY,i=a._snapThresholdCfg,k=a.allowScroll.left&&Math.abs(f)>i,j=a.allowScroll.top&&Math.abs(e)>i;z(a,b,"left",d);z(a,b,"top",d)}function K(b){if(b.isTouch&&(b.preventDefault(),!(this.get("disabled")||this.isScrolling&&this.pagesOffset)&&this.isScrolling))this.stopAnimation(),this.fire("scrollTouchEnd",{pageX:b.pageX,pageY:b.pageY})}var L=u("./base"),M=u("node"),F=u("anim"),y=0.5,N=M.Gesture,A=6,v=20,B=Math.log(0.95),G=B/v,H=
0.3,C=function(b){if(this.isScrolling){var d=Math.abs(b.deltaX),a=Math.abs(b.deltaY),c=this._lockX,f=this._lockY;if(c||f){var e;if(!(e=this.dragInitDirection))this.dragInitDirection=e=d>a?"left":"top";if(c&&"left"===e&&!this.allowScroll[e]){this.isScrolling=0;this._preventDefaultX&&b.preventDefault();return}if(f&&"top"===e&&!this.allowScroll[e]){this.isScrolling=0;this._preventDefaultY&&b.preventDefault();return}}b.preventDefault();w(this,b,"left");w(this,b,"top")}};return L.extend({initializer:function(){this._preventDefaultY=
this.get("preventDefaultY");this._preventDefaultX=this.get("preventDefaultX");this._lockX=this.get("lockX");this._lockY=this.get("lockY");this._bounce=this.get("bounce");this._snapThresholdCfg=this.get("snapThreshold");this._snapDurationCfg=this.get("snapDuration");this._snapEasingCfg=this.get("snapEasing");this.publish("touchEnd",{defaultFn:J,defaultTargetOnly:!0})},bindUI:function(){this.$contentEl.on("dragStart",I,this);this.$contentEl.on(N.start,K,this)},destructor:function(){this.stopAnimation()},
stopAnimation:function(){this.callSuper();this.isScrolling=0}},{ATTRS:{lockX:{value:!0},preventDefaultX:{value:!0},lockY:{value:!1},preventDefaultY:{value:!1},snapDuration:{value:0.3},snapEasing:{value:"easeOut"},snapThreshold:{value:5},bounce:{value:!0},bounceDuration:{value:0.4},bounceEasing:{value:"easeOut"}}})});