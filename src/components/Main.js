require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

//获取图片相关的数据
let imgDatas = require('../data/imgDatas.json')
//将图片文件名转成路径信息，每个图片对象多了一个url属性
imgDatas = function(imgsArray){
	for(let i=0;i<imgsArray.length;i++){
		imgsArray[i].url = require('../images/'+imgsArray[i].filename);
	}
	return imgsArray
}(imgDatas)

let ImgFigure = React.createClass({
    handleClick:function(e){
        if(this.props.arrange.isCenter){
            this.props.inverse()
        }else{
            this.props.center()
        }

        e.stopPropagation();
        e.preventDefault();
    },
    render:function(){
        let styleObj = {};
        if(this.props.arrange.pos){
            styleObj = {left:this.props.arrange.pos.left + 'px',top:this.props.arrange.pos.top + 'px'};
        }
        if(this.props.arrange.rotate!==0){
            (['WebkitTransfrom','msTransform','MozTransform','transform']).forEach(function(item){
                styleObj[item] = 'rotate(' + this.props.arrange.rotate+ 'deg)';
            }.bind(this))
        }
        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11
        }

        let imgFigureClassName = 'imgFigure';
            imgFigureClassName += this.props.arrange.isInverse?' is-inverse':''

        return(
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
            <div className="imgBack" onClick={this.handleClick}>
                <p>
                    {this.props.data.desc}
                </p>
            </div>
            <img src={this.props.data.url} alt={this.props.data.title} width="180px" height="180px"/>
            <figcaption>
            <h2 className="imgTitle">{this.props.data.title}</h2>
            </figcaption>
        </figure>
        )
    }
})

let ControllerUnits = React.createClass({
    handleClick:function(e){

        if(this.props.arrange.isCenter){
            this.props.inverse()
        }else{
            this.props.center()
        }

        e.stopPropagation();
        e.preventDefault();
    },
    render:function(){
        let controllerUnitsClassName = 'controllerUnits';
        if(this.props.arrange.isCenter){
            controllerUnitsClassName += ' isCenter';
            if(this.props.arrange.isInverse){
                controllerUnitsClassName += ' isInverse';
            }
        }
        return(
                <span className={controllerUnitsClassName} onClick={this.handleClick}></span>
            )
    }
})

function getRangeRandom(low,high){
    return Math.ceil(Math.random()*(high - low) + low)
}
function get30DegRandom(){
    return Math.random()>0.5?Math.ceil(Math.random()*30):Math.ceil(Math.random()*30)*(-1)
}

let AppComponent = React.createClass({
    Constant:{
        centerPos:{
            left:'0px',
            top:'0px'
        },
        hPosRange:{
            leftSecX:[0,0],
            rightSecX:[0,0],
            y:[0,0]
        },
        vPosRange:{
            x:[0,0],
            topY:[0,0]
        }
    },

    inverse:function(index){
        return function(){
            var imgsArrayArr = this.state.imgsArrayArr;
            imgsArrayArr[index].isInverse = !imgsArrayArr[index].isInverse
            this.setState({
                imgsArrayArr:imgsArrayArr
            })
        }.bind(this)
    },

    center:function(index){
        return function(){
            this.rearrange(index)
        }.bind(this)
    },

    rearrange:function(centerIndex){
        let imgsArrayArr = this.state.imgsArrayArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random()*2),
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrayArr.splice(centerIndex,1);

            imgsArrangeCenterArr[0].pos = centerPos;
            imgsArrangeCenterArr[0].rotate = 0;
            imgsArrangeCenterArr[0].isCenter = true;

            topImgSpliceIndex = Math.floor(Math.random() * (imgsArrayArr.length - topImgNum));
            imgsArrangeTopArr = imgsArrayArr.splice(topImgSpliceIndex,topImgNum);

            imgsArrangeTopArr.forEach((value,index)=>{
                imgsArrangeTopArr[index].pos = {
                    top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]) ,
                    left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                }
                imgsArrangeTopArr[index].rotate = get30DegRandom()
                imgsArrangeTopArr[index].isCenter = false;
            })

            for(let i = 0,j = imgsArrayArr.length,k = j / 2;i < j;i++){
                let hPosRangeLORX = null;
                if(i < k){
                    hPosRangeLORX = hPosRangeLeftSecX;
                }else{
                    hPosRangeLORX = hPosRangeRightSecX;
                }
                imgsArrayArr[i].pos = {
                    top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                    left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                }
                imgsArrayArr[i].rotate = get30DegRandom()
                imgsArrayArr[i].isCenter = false;
            }

            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrayArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
            }

            imgsArrayArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);



            this.setState({
                imgsArrayArr:imgsArrayArr
            }
            )

    },

    getInitialState:function(){

        return {
            imgsArrayArr:[
                {
                    // pos:{
                    //     left:'0px',
                    //     top:'0px'
                    // },
                    //rotate:0,
                    //isInverse:false,
                    //isCenter:false
                }
            ]
        }
    },

    componentDidMount:function(){
        let stageDom = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.ceil(stageW/2),
            halfStageH = Math.ceil(stageH/2);

        let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDom.scrollWidth,
            imgH = imgFigureDom.scrollHeight,
            halfImgW = Math.ceil(imgW/2),
            halfImgH = Math.ceil(imgH/2);

        this.Constant.centerPos = {
            left:halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = - halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW-halfImgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
       
    },
  render:function() {
    let imgComp = [],controllerUnits=[];
    imgDatas.forEach(function(item,index){
        if(!this.state.imgsArrayArr[index]){
            this.state.imgsArrayArr[index] = {
                pos:{
                    left:0,
                    top:0
                },
                rotate:0,
                isInverse:false,
                isCenter:false
            }
        }
        imgComp.push(<ImgFigure data={item} ref={'imgFigure'+index} key={'key_'+index} arrange={this.state.imgsArrayArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
        controllerUnits.push(<ControllerUnits key={'ckey_'+index} arrange={this.state.imgsArrayArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
    }.bind(this));
    return (
     <section className="stage" ref="stage">
     	<section className="img-sec">
        {imgComp}
     	</section>
     	<nav className="controller-nav">
        {controllerUnits}
     	</nav>
     </section>
    );
  }

})

AppComponent.defaultProps = {
};

export default AppComponent;
