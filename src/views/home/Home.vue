<!--  -->
<template>
<div id="homeCss">
  <div class="header">
    <!-- <router-link to="/"><img src="../../assets/logo.png" alt="吉家网" class="fl"></router-link> -->
     <router-link to="/home"><img :src="companyLogo" alt="吉家网" class="fl"></router-link>
    <div class="fl">
      <el-menu :default-active="this.$route.name" class="el-menu-demo" mode="horizontal" background-color="#32323a" text-color="#fff" active-text-color="#fda100" :router="isRouter">
          <el-submenu index="1">
            <template slot="title">项目管理</template>
            <el-menu-item v-for="(item, index) in projectBar" :index="item.index"
            :key="index">{{item.name}}</el-menu-item>
          </el-submenu>
          <el-submenu index="2" v-show="false">
            <template slot="title">报表管理</template>
            <el-menu-item v-for="(item, index) in statementBar" :index="item.index"
            :key="index">{{item.name}}</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">财务管理</template>
              <el-menu-item v-for="(item, index) in financeBar" :index="item.index"
            :key="index">{{item.name}}</el-menu-item>
            </el-submenu>
          <el-submenu index="4">
            <template slot="title">系统设置</template>
            <el-menu-item index="orgFramework">组织架构</el-menu-item>
            <el-menu-item index="dataDictionary">数据字典</el-menu-item>
            <el-menu-item index="bannerManage">banner管理</el-menu-item>
            <el-menu-item index="announceManage">公告管理</el-menu-item>
            <el-menu-item index="" @click.native="editPhone">编辑头像</el-menu-item>
            <el-menu-item index="" @click.native="dropCompany">退出企业</el-menu-item>
          </el-submenu>
      </el-menu>
    </div>
  <ul class="fr nav-right">
        <li>
          <router-link to="/home/announceManage">
            <el-badge :value="this.$store.state.announceNum" :max="99" class="add-number">
              <i class="el-icon-bell"></i>
            </el-badge>
          </router-link>
        </li>
        <li class="username">
          用户名: {{this.$store.state.person.mobile}}({{this.$store.state.person.name}})
        </li>
        <li>
          <router-link to="/login" @click.native="dropAdmin">注销</router-link>
        </li>
      </ul>
  </div>
    <div class="clearfix"></div>
   <el-breadcrumb separator=" > " class="cur-position">
      <el-breadcrumb-item v-for="item in breadList" :key="item.index">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- 退出企业弹框 -->
  <div class="home_dropCompany">
        <el-dialog
        title='退出企业'
        :visible.sync="dropCompanyBox"
        >
      <p>&nbsp;手 机 号 码：<span>{{dropCompanyPhone}}</span></p>
        短信验证码：<el-input v-model="dropCompanyCode" placeholder="请输入内容" inline="true"></el-input> 
        <div class="sendCode" v-show="sendCode" @click="getPhoneCd">发送验证码</div>
        <div class="sendCode" v-show="secondNote">还剩{{againTime}}秒</div>
        <p class="dropContent">退出企业后您名下还有<span style="color: #f84949;">{{privateNum}}</span>个私客，将掉入公池</p>
        <p class="dropContent">请确定是否退出企业</p>
        <div class="move_footer">
            <el-button  @click="sureDropCompany" class="sureAdd">确 定</el-button>
            <el-button @click="noDropCompany" class="noAdd">取 消</el-button>
        </div>
        </el-dialog>
  </div>
  <!-- 编辑头像弹框 -->
  <div class="home_editPhone">
       <el-dialog title="修改头像" :visible.sync="editPhoneBox">
         <!-- <img src="../../assets/logo.png" alt=""> -->
         <div class="ceshi"></div>
         <div class="message">请选择一张新照片进行上传编辑（大小不超过<span style="color: #f84949;">300kb</span>）</div>
         <div>
            <div class="cut">
              <span class="icon icon-fanhui editPhone-icon" @click="rotateRight"></span>
              <vue-cropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType" :info="true"
                :can-move="option.canMove" :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
                :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox"
                @real-time="realTime" :high="option.high" ></vue-cropper>
            </div>
            <div class="test-button">                                          
              <label class="btn-upload" for="uploads"><span class="icon icon-shangchuan"></span> 本地上传</label>
              <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"
                @change="uploadImg($event, 1)">

            </div>
        </div>
        <div class="bigPhoneBox" :style="note"><span>140 * 140</span></div>
        <div class="smallPhoneBox" :style="note"><span>80 * 80</span></div>
      <div class="move_footer">
        <!-- <el-button @click="finish('blob')" class="noAdd">取消</el-button> -->
        <el-button  @click="finish('blob')" class="noAdd" >预 览</el-button>
        <el-button  @click="sureEditHeadImg" class="sureAdd" >确 定</el-button>
      </div>
      </el-dialog>
  </div>
  <router-view></router-view>
</div>
</template>
<script>
import VueCropper from "vue-cropper";
import axios from "axios";
import {
  editHeadImg,
  getPersonEmployee,
  getPhoneCode,
  dropCompany,
  getPersonInfo
} from "@/api";
export default {
  components: { "vue-cropper": VueCropper },
  data() {
    return {
      crap: false,
      option: {
        img: this.$store.state.person.headImg,
        size: 1,
        outputType: "png,jpg",
        canMove: false, // 能否拖动图片
        fixedBox: true, // 截图框固定大小
        original: false, //上传是否显示原始宽高
        canMoveBox: true, // 是否拖动截图框
        autoCrop: true, // 是否自动生成截图框
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 140,
        autoCropHeight: 140,
        centerBox: true, // 截图框是否限制在图片里
        high: true // 是否生成高清图片
      },
      note: {
        backgroundImage: "",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        marginTop: "5px"
      },
      defaultCompanyLogo: require("../../assets/logo.png"),
      isRouter: true,
      breadList: [],
      newsNum: 1,
      dropCompanyBox: false, // 退出企业的弹框显示
      dropCompanyPhone: this.$store.state.person.mobile || "", // 退出企业的当前用户手机
      privateNum: 2, // 退出企业的私客数量
      dropCompanyCode: "", // 退出企业的短信验证码
      editPhoneBox: false, // 编辑头像的弹框显示
      sendCode: true, // 发送验证码按钮框显示
      secondNote: false, // 倒计时框显示
      againTime: 60, // 倒计时时间
      Img: "",
      projectBar: [
        {
          index: "project",
          name: "项目列表"
        },
        {
          index: "dropPrepare",
          name: "退筹确认"
        },
        {
          index: "dropHouse",
          name: "退房确认"
        }
      ],
      statementBar: [
        {
          index: "businessInfo",
          name: "业务报表"
        },
        {
          index: "financeInfo",
          name: "财务报表"
        }
      ],
      financeBar: [
        {
          index: "contractManage",
          name: "合同管理"
        }
      ],
      showSureClick: false,
      showLookClick: true,
      headPhoto: 0
    };
  },
  methods: {
    //编辑头像的所以方法
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    finish(type) {
      console.log(type);
      this.$refs.cropper.getCropBlob(data => {
        console.log(data);
        this.headPhoto = data.size;
        console.log(this.note.backgroundImage);
        var img = window.URL.createObjectURL(data);
        console.log(img);
        this.note.backgroundImage = "url(" + img + ")";
      });
      this.showSureClick = true;
      this.showLookClick = false;
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data;
    },
    uploadImg(e, num) {
      // debugger
      let form = new FormData();
      let file = e.target.files[0];
      if (file.size / 1024 > 300) {
        this.alertMessage("warning", "头像大小不超过300kb");
        // return false
      }
      form.append(file.name, file);
      form.append("watermark", false);
      let url = "/img/upload";
      console.log(form);
      console.log(file);
      this.headPhoto = file.size;
      axios.post(url, form).then(res => {
        this.Img = res.data.images[0].src;
        console.log(this.Img);
      });
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        } else if (num === 2) {
          this.example2.img = data;
        }
      };
      reader.readAsArrayBuffer(file);
    },
    // 点击退出企业
    dropCompany() {
      this.dropCompanyBox = true;
      getPersonEmployee({ params: { id: this.$store.state.person.id } })
        .then(res => {
          if (res.status === 200) {
            this.privateNum = res.data;
          }
        })
        .catch(err => {
          this.privateNum = "??";
        });
    },
    // 点击编辑头像
    editPhone() {
      // this.showSureClick = false
      // this.showLookClick = true
      // console.log(JSON.parse(localStorage.getItem("myInfo")).headImg.split(",")[0]);
      console.log(this.$store.state.person.headImg);
      axios
        .put("/api/personal/headImg/can")
        .then(res => {
          if (res.status === 200) {
            this.editPhoneBox = true;
            // this.note.backgroundImage = JSON.parse(localStorage.getItem("myInfo")).headImg;
          } else {
            this.alertMessage("warning", "无操作权限");
          }
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无编辑权限");
            return;
          }
        });
    },
    // 点击确认编辑头像
    sureEditHeadImg() {
      if (this.headPhoto / 1024 > 300) {
        this.alertMessage("warning", "头像大小不超过300kb");
        return;
      }
      editHeadImg({ headImg: this.Img }).then(res => {
        if (res.status === 200) {
          this.alertMessage("success", "编辑成功");
          this.editPhoneBox = false;
          this.option.img = this.Img;
          // localStorage.setItem()
          getPersonInfo().then(res => {
            localStorage.setItem("myInfo", JSON.stringify(res.data));
          });
        } else {
          this.alertMessage("warning", res.message);
        }
      });
    },
    // 点击确定退出企业
    sureDropCompany() {
      dropCompany({ params: { captcha: this.dropCompanyCode } }).then(res => {
        if (res.status === 200) {
          this.alertMessage("success", "已退出企业");
          this.dropCompanyBox = false;
        } else {
          this.alertMessage("warning", res.message);
        }
      });
      this.dropCompanyBox = false;
    },
    // 点击取消退出企业
    noDropCompany() {
      this.dropCompanyBox = false;
    },
    // 点击注销
    dropAdmin() {
      localStorage.setItem("checkIsLogin", false);
      this.$store.commit("del_token");
    },
    // 发送短信验证码
    getPhoneCd() {
      getPhoneCode({ params: { mobile: this.dropCompanyPhone, type: 2 } }).then(
        res => {
            if (res.status === 200) {
              this.sendCode = false;
              this.secondNote = true;
              let timerId = setInterval(() => {
              this.againTime--;
              if (this.againTime == 0) {
                clearInterval(timerId);
                this.againTime = 60;
                this.sendCode = true;
                this.secondNote = false;
              }
            }, 1000);
          }else{
            this.alertMessage("warning", res.message)
            return
          }
          console.log(res);
        }
      );
    }
  },
  created() {
    this.breadList = this.$route.meta.roles;
  },
  beforeRouteUpdate(to, from, next) {
    this.breadList = to.meta.roles;
    next();
  },
  // 秦星星加
  computed: {
    companyLogo() {
      return this.$store.state.person.companyLogo || this.defaultCompanyLogo;
    }
  }
};
</script>
<style lang='scss'>
#homeCss {
  .header {
    width: 100%;
    height: 58px;
    background: #32323a;
    line-height: 58px;
    img {
      margin-left: 45px;
      width: 126px;
      height: 58px;
    }
    .el-menu {
      padding-left: 125px;
    }
    /deep/ .el-menu--horizontal > .el-submenu.is-active .el-submenu__title{
      background: rgb(40, 40, 46)!important;
      color: white!important;
    }
    .breadStyle {
      padding: 0 20px;

      height: 42px;

      color: #666;

      line-height: 42px;
    }
    .nav-right {
      float: right;
      > li {
        position: relative;

        float: left;

        height: 58px;
        border-left: 1px solid #2a2a40;
        i {
          position: relative;

          top: 3px;

          padding: 0 8px;

          font-size: 20px;
        }
      }

      li > a,
      .el-badge {
        height: 58px;
        color: #b1b1c2;

        font-size: 12px;
      }
      li > a {
        display: inline-block;

        padding: 0 20px;
      }
      .username {
        overflow: hidden;
        padding: 0;

        padding: 0 17px;

        max-width: 179px;
        color: #b1b1c2;

        text-align: center;

        text-overflow: ellipsis;

        white-space: nowrap;
        font-size: 12px;

        cursor: pointer;

        -o-text-overflow: ellipsis;

        -moz-text-overflow: ellipsis;
      }
    }
  }
  .home_dropCompany {
    .el-dialog {
      width: 514px;
      height: 378px;
      .el-input {
        display: inline;
        .el-input__inner {
          width: 244px;
        }
      }
      p {
        height: 40px;
        line-height: 40px;
        &:nth-of-type(2) {
          color: #666;
        }
        &:nth-of-type(3) {
          color: #f84949;
        }
        span {
          color: #666;
        }
      }
      .move_footer {
        margin-top: 50px;
      }
      .sendCode {
        display: inline-block;
        width: 104px;
        height: 30px;
        background-color: #fd8f00;
        border-radius: 3px;
        text-align: center;
        line-height: 30px;
        color: #fff;
        margin-left: 8px;
        cursor: pointer;
      }
      .dropContent {
        text-align: center;
      }
    }
  }
  .home_editPhone {
    .el-dialog {
      width: 770px;
      height: 540px;
      line-height: 15px;
      .move_footer {
        margin-top: 36px;
      }
      .message {
        color: #666;
        margin-left: 150px;
      }
      .cut {
        width: 310px;
        height: 310px;
        margin-left: 110px;
        margin-top: 30px;
        position: relative;
        .editPhone-icon {
          position: absolute;
          right: 0;
          z-index: 2;
          color: #fff;
          cursor: pointer;
        }
      }
      .test-button {
        margin-left: 111px;
        .btn-upload {
          position: absolute;
          top: 55px;
          left: 36px;
          width: 113px;
          height: 34px;
          background-color: #72a0d1;
          border-radius: 3px;
          text-align: center;
          line-height: 34px;
          color: #fff;
          cursor: pointer;
        }
      }
      .bigPhoneBox,
      .smallPhoneBox {
        span {
          position: absolute;
          top: 108%;
          left: 25%;
        }
      }
      .smallPhoneBox {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 1px solid #ccc;
        position: absolute;
        // background-color: #9eb7db;
        top: 120px;
        right: 131px;
      }
      .bigPhoneBox {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        border: 1px solid #ccc;
        position: absolute;
        // background-color: #9eb7db;
        bottom: 124px;
        right: 101px;
        span {
          left: 30%;
        }
      }
    }
  }
  .ceshi {
    background: url("../../assets/logo.png") no-repeat center center;
  }
}
</style>