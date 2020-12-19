<template>
  <message-bubble :isMine="isMine" :message=message>
    <a class="geo-element" :href="href" target="_blank" title="点击查看详情">
<!--      <span class="el-icon-location-outline">{{payload.description}}</span>-->
      <span style="font-size: 16px;padding: 10px 10px 0 10px">{{title}}</span>
      <span style="color: #999999;font-size: 12px;padding:5px 10px">{{desc}}</span>
<!--      <img :src="url" />-->
        <img src="../../../assets/image/img_location_default.png" width="100%"/>
    </a>
  </message-bubble>
</template>

<script>
import MessageBubble from '../message-bubble'

export default {
  name: 'GeoElement',
  components: {
    MessageBubble
  },
  props: {
    payload: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    isMine: {
      type: Boolean
    }
  },
  data() {
    return {
      url: ''
    }
  },
  computed: {
    lon() {
      return this.payload.longitude.toFixed(6)
    },
    lat() {
      return this.payload.latitude.toFixed(6)
    },
    href() {
      return `https://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&pointx=${
        this.lon
      }&pointy=${this.lat}&name=${this.payload.description}`
    },
    title() {
      return this.payload.description.split('##')[0]
    },
    desc() {
      return this.payload.description.split('##')[1]
    }
  },
  mounted() {
    this.url = `https://apis.map.qq.com/ws/staticmap/v2/?center=${this.lat},${
      this.lon
    }&zoom=10&size=300*150&maptype=roadmap&markers=size:large|color:0xFFCCFF|label:k|${
      this.lat
    },${this.lon}&key=UBNBZ-PTP3P-TE7DB-LHRTI-Y4YLE-VWBBD`
  }
}
</script>

<style lang="stylus" scoped>
.geo-element {
  text-decoration: none;
  color: #000;
  display: flex;
  flex-direction: column;
  font-size: 18px;

  img {
    margin-top: 5px;
  }
}
</style>
