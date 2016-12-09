require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
// let yeomanImage = require('../images/yeoman.png');
let imageDatas = require('../data/imageDatas.json');

imageDatas = (function genImageUrl(imageDatasArr){

	for (var i = 0; i < imageDatasArr.length; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.filename);

		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas)

function getRangeRandom(low, high){
    return Math.ceil(Math.random() * (high - low)) + low;
}

function get30DegRandom() {
   return (Math.random() > 0.5 ? '': '-' ) + Math.ceil(Math.random() * 30);
}

var ImgFigure = React.createClass({
    handleClick: function(e){
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    },
    render: function () {
        var styleObj = {};

        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        };

        if (this.props.arrange.rotate) {
            ['-moz-', '-ms-', '-webkit-', ''].forEach(function  (value) {

                 styleObj[value + 'transform'] = 'rotate('+ this.props.arrange.rotate +'deg)';

            }.bind(this))
           
        }

        if (this.props.arrange.isCenter) {
            styleObj['zIndex'] = 11;
        };
        var imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
        return(
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageURL}
                alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className='img-back' onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
});

var ControllerUnits = React.createClass({
    handleClick: function(e) {
        if (this.props.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }
        e.preventDefault();
        e.stopPropagation();
    },
    render: function() {
         var controllerUnitsClassName = "controller-units";
            if (this.props.arrange.isCenter) {
                controllerUnitsClassName += " is-center"
            };
            if (this.props.arrange.isInverse) {
                controllerUnitsClassName += " is-inverse";
            };
        return (
           
            <span className={controllerUnitsClassName} onClick={this.handleClick}></span>
        );
    }
});

var GallaryByReactApp = React.createClass({
    Constant:{
        currentPos: {
            left: 0,
            right: 0
        },
        hPosRange: {
            leftSecx: [0, 0],
            rightSecx: [0, 0],
            y: [0, 0]
        },
        vPosRange: {
            x: [0, 0],
            topY: [0, 0]
        }
    },
    inverse: function(index){
        return function  () {
           var imgsArrrangArr = this.state.imgsArrrangArr;
           imgsArrrangArr[index].isInverse = !imgsArrrangArr[index].isInverse;
           this.setState({
                imgsArrrangArr: imgsArrrangArr
           });
        }.bind(this);
    },
    componentDidMount() {
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW/2),
            halfStageH = Math.ceil(stageH/2);

        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW/2),
            halfImgH = Math.ceil(imgH/2);
        // 中心图片位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }


        this.Constant.hPosRange.leftSecx[0] = -halfImgW;
        this.Constant.hPosRange.leftSecx[1] = halfStageW -halfImgW*3;
        this.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;

        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW

        this.rearange(0);
    },
    rearange: function (centerIndex) {
        var imgsArrrangArr = this.state.imgsArrrangArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecx,
            hPosRangeRightSecX = hPosRange.rightSecx,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrrangTopArr = [],
            topImgNum = Math.ceil(Math.random() * 2),
            topImgSliceIndex = 0,


            imgsArrrangCenterArr = imgsArrrangArr.splice(centerIndex, 1);
            imgsArrrangCenterArr[0] = {
                pos: centerPos,
                rotate: 0,
                isCenter: true
            }
              


            topImgSliceIndex = Math.floor(Math.random() * (imgsArrrangArr.length - topImgNum));
            imgsArrrangTopArr = imgsArrrangArr.splice(topImgSliceIndex, topImgNum);

            // 位于上侧的图片
            imgsArrrangTopArr.forEach(function(value, index){
                imgsArrrangTopArr[index] = {
                    pos:{
                        top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                        left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter:false
                   
                }
            });
            
            //布局位于两侧的图片
            for (var i = 0, j = imgsArrrangArr.length, k = j / 2; i < j; i++) {
                var hPosRangeLORX = null;

                if (i < k) {
                    hPosRangeLORX = hPosRangeLeftSecX;
                }else{
                    hPosRangeLORX = hPosRangeRightSecX;
                }

                imgsArrrangArr[i] = {
                    pos: {
                        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                    
                }   

            }
            if (imgsArrrangTopArr && imgsArrrangTopArr[0]) {
                    imgsArrrangArr.splice(topImgSliceIndex, 0, imgsArrrangTopArr[0]);
                }
            imgsArrrangArr.splice(centerIndex, 0, imgsArrrangCenterArr[0]);
          
            this.setState({
                imgsArrrangArr: imgsArrrangArr
            })
    },
    center: function(index){
        return function() {
            this.rearange(index);
        }.bind(this);

    },
    getInitialState: function() {
        return {
            imgsArrrangArr: [
                // {
                //     pos: {
                //         left:0,
                //         right:0,
                //     },
                //    rotate: 0,
                //    isInverse: false,
                //    isCenter: false
                // }
            ]
        }
    },
  render: function () {

    var controllerUnits = [],
        imgFigures = [];

        imageDatas.forEach(function (value, index) {
            if (!this.state.imgsArrrangArr[index]) {
                this.state.imgsArrrangArr[index] = {
                    pos: {
                        left: 0,
                        top:0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index}
                arrange={this.state.imgsArrrangArr[index]} inverse = {this.inverse(index)}
                center = {this.center(index)}/>)
            controllerUnits.push(<ControllerUnits key={index} arrange={this.state.imgsArrrangArr[index]} 
                inverse = {this.inverse(index)}
                center = {this.center(index)}/>)
        }.bind(this));

    return (
        <section className="stage" ref="stage">
        	<section className="img-sec">
              {imgFigures}
      		</section>
      		<nav className="controller-nav">
              {controllerUnits}
      		</nav>
        </section>
    );
  }
})

ReactDOM.render(<GallaryByReactApp/>, document.getElementById('app'));

module.exports = GallaryByReactApp;