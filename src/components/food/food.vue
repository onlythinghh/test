<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol @add="addFood" :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <spilt v-show="food.info"></spilt>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <spilt></spilt>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <!--ul 与no-rating 二者只显示其一 -->
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0, 'icon-thumb_down':rating.rateType===1}"></span> <!--赞与不攒-->
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import {formatDate} from 'common/js/date'; //时间模块
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import ratingselect from 'components/ratingselect/ratingselect';
  import spilt from 'components/spilt/spilt';

  const ALL = 2;
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if (!event._constructed) {
        return;
      }
      this.$emit('add', event.target);
      Vue.set(this.food, 'count' , 1);
    },
    needShow(type, text) {  //type:选项 text:只看有内容的
      if (this.onlyContent && !text) { //1.显示所有内容 2.只看有内容的（评论）
          return false;
      }
      if (this.selectType === ALL) { //如果当前类型是全部（selectType）则直接显示
          return true;
      }else {   //否则 selectType的类型必须与当前（被点击的）数据类型一致才可显示
          return type === this.selectType;
      }
    },
    addFood(target) {
      this.$emit('add', target);
    },
    selectRating(type) {
      this.selectType = type;
      this.$nextTick(() => {  //异步更新dom
        this.scroll.refresh();
      });
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent;
      this.$nextTick(() => {  //异步更新dom
        this.scroll.refresh();
      });
    }
  },
  filters: { //时间戳
    formatDate(time) {
      let date = new  Date(time);
      return formatDate(date, 'yyyy-MMM-dd hh-mm');
    }
  },
  components: {
    'cartcontrol': cartcontrol,
    'spilt': spilt,
    'ratingselect': ratingselect
  }
};
</script>
<style type="styles" rel="stylesheet/less" lang="less">
  @import '../../common/stylus/mixin';
.food{
  position: fixed;
  left: 0;
  top:0;
  bottom: 48px;
  z-index: 30; /*要小于购物车和购物车弹出层*/
  width: 100%;
  background: #fff;
  transform: translate3d(0,0,0);
  &.move-enter-active,&.move-leave-active{
    transition: all 0.2s linear;
  }
  &.move-enter,&.move-leave-active{
    transform: translate3d(100%,0,0);
  }
  .image-header{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    img{
      position: absolute;
      top:0;
      left:0;
      width: 100%;
      height:100%;
    }
    .back{
      position: absolute;
      top:10px;
      left:0;
      .icon-arrow_lift{
        display: block;
        padding: 10px;
        font-size: 20px;
        color: #fff;
      }
    }
  }
  .content{
    padding:18px;
    position: relative;
    .title{
      line-height: 14px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 700;
      color: rgb(7,17,27);
    }
    .detail{
      margin-bottom: 18px;
      height: 10px;
      line-height: 10px;
      font-size: 0;
      .sell-count,.rating{
        font-size: 10px;
        color: rgb(147,153,159);
      }
      .sell-count{
        margin-right: 12px;
      }
    }
    .price{
      font-weight: 700;
      line-height: 24px;
      .now{
        margin-right: 8px;
        font-size: 14px;
        color: rgb(240,20,20);
      }
      .old{
        text-decoration: line-through;
        font-size: 14px;
        color: rgb(147,153,159);
      }
    }
    .cartcontrol-wrapper{
      position: absolute;
      right: 12px;
      bottom: 12px;
    }
    .buy{
      position: absolute;
      right: 18px;
      bottom: 18px;
      z-index: 10;
      height:24px;
      line-height: 24px;
      padding: 0 12px;
      box-sizing: border-box;
      font-size: 10px;
      color: #fff;
      border-radius: 12px;
      background: rgb(0, 160, 220);
      opacity: 1;
      &.fade-enter-active, &.fade-leave-active{
        transition: all .2s;

      }
      &.fade-enter, &.fade-leave-active{
        opacity: 0;
        z-index: -1;
      }
    }
  }
  .info{
    padding: 18px;
    .title{
      line-height: 14px;
      margin-bottom: 6px;
      font-size: 14px;
      color: rgb(7,17,27);
    }
    .text{
      line-height: 24px;
      padding: 0 8px;
      font-size: 12px;
      color: rgb(77,85,93);
    }
  }
  .rating{
    padding-top: 18px;
    .title{
      line-height: 14px;
      margin-left: 18px;
      font-size: 14px;
      color: rgb(7,17,27);
    }
    .rating-wrapper{
      padding: 0 8px;
      .rating-item{
        position: relative;
        padding: 16px 0;
        .border-px(rgba(7, 17, 27,0.2));
        .user{
          position: absolute;
          right: 0;
          top:16px;
          line-height: 12px;
          font-size: 0;
          .name{
            display: inline-block;
            vertical-align: top;
            margin-right: 6px;
            font-size: 10px;
            color: rgb(147,153,159);
          }
          .avatar{
            border-radius: 50%;
          }
        }
        .time{
          margin-bottom: 6px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147,153,159);
        }
        .text{
          line-height: 16px;
          font-size: 12px;
          color: rgb(7,17,27);
          .icon-thumb_up,.icon-thumb_down{
            margin-right: 4px;
            line-height: 16px;
            font-size: 12px;
          }
          .icon-thumb_up{
            color: rgb(0,160,220);
          }
          .icon-thumb_down{
            color: rgb(147,153,159);
          }
        }
      }
      .no-rating{
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147,153,159);
      }
    }
  }

}
</style>
