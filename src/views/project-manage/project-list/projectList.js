  import {
    getProjectTableList,
    getProjectTableRowInfo,
    getProjectStatistics,
    getTargetPlaceInfo,
    getAllProjectST,
    getAllProvince,
    getAddAreaList,
    getAddBusinessList,
    addNewProject,
    getMyCompany
  } from '@/api/index'
  import {
    RULE
  } from '@/api/rules'
  import {
    CITY
  } from '@/api/city'
  import axios from 'axios'
  import {
    isProjectPrice
  } from "@/views/login/validate.js"
  import ImageCompressor from 'image-compressor.js';
  let activeItem = null
  export default {
    mixins: [RULE, CITY],
    data() {
      return {
        // 表单中的数据
        formInline: {
          province: "",
          city: "",
          area: "",
          business: "",
          status: "",
          type: "",
          houseName: ""
        },
        // 新增表单
        dialogAddFormVisible: false,
        addForm: {
          projectType: "",
          projectState: "",
          name: "",
          provinceId: "",
          cityId: "",
          areaId: "",
          businessDistrictId: "", // 商区
          buildingPrice: '',
          address: "",
          coordinate: "", // 地图坐标
          statusSell: "", //  是否上架
          buildingProperty: "", // 楼盘性质
          platform: [], // 同步系统
          customerType: "", // 项目有效类型
          moneyDes: "", // 佣金
          proTimeAgentReport: "", //  报备保护期
          reportRule: "", //   报备规则
          proTimeAgentLook: "", //  带看保护期
          proTimeDownPayment: "", //   下定保护期
          dialogImageUrl: "",
          projectPictureList: [],
          otherInfo: "",
        },
        dialogImageVisible: false, // 新增 图片框
        dialogImageAllVisible: false, // 项目明细 图库里的 全部图
        dialogImageUrlAll: "",
        dialogImageTypeVisible: false, // 项目明细 图库里的 户型图
        dialogImageUrlType: "",
        keyWordCompany: [],
        // table表格中的数据
        tableData: [],
        getRowKeys(row) {
          return row.id;
        },
        expands: [],
        // 单击表格行 展开行内数据
        rowExpand: {},
        // 单击展开行 弹出 项目编辑模态框
        EditVisible: false,
        editDialogform: {},
        rowDblclickId: 0, // 项目明细的id
        // 项目编辑 模态框 校验规则

        //  项目统计 模态框
        statisticsVisible: false,
        statisticsTable: {
          type: 1,
          employeeName: "报备人",
          time: "报备提交时间",
          state: "报备状态",
          info: "报备",
          valid: "有效报备",
          unit: "位",
          amount: "认筹金额"
        },
        statisticsCount: {},
        SearchStatisticsForm: {
          buildingId: 0,
          day: 5,
          startTime: '',
          endTime: '',
          type: 1,
          pageSize: 5,
          pageNum: 1
        },
        countSum: 0, //项目统计总条数
        // 项目统计 表格
        statisticsTableData: {},
        amountTJShow: false,
        stateTJShow: true,
        hadUnsubscribeShow: false,
        currentPhase: "全部",
        // 双击表格行 弹出 项目明细模态框
        detailVisible: false,
        personVisible: false,
        setPhoneRuleBox: false,
        setPhoneRuleForm: {},
        detailInfo: {},
        // 弹出内层模态框 分配人员
        allotPersonForm: {
          id: '',
          name: "",
          phone: "",
          duty: "",
          mobileShowMode: 2
        },
        allotPersonRules: {
          projectPreson: [{
            required: true,
            message: "请输入项目驻场",
            trigger: "blur"
          }]
        },
        personTableData: [],
        //确认删除模态框
        confirmDelVisible: false,
        delRowindex: 1,
        imgStore: "first",
        operateLogTableData: [],
        getTargetPlaceData: {},
        projectStatusData: [], // 所有的项目状态列表
        projectTypeData: [], // 所有的项目类型列表
        pageNum: 1, //分页器当前页
        pageSize: 5, //分页器每页的大小
        count: 0, //  分页器数据的总条数
        keyWordForm: {}, // 关键词搜索的表单数据对象
        allProvinceData: [], // 关键词搜索所有省份的数据
        allCityData: [], // 关键词搜索所有省份下城市的数据
        allAreaData: [], // 关键词搜索所有的片区的数据
        allBusinessData: [], // 关键词搜索所有的商圈数据
        addAllCityData: [], //新增项目中所有的城市
        addGetAreaData: {}, // 新增中用来存储城市id和区域id
        addAllAreaData: [], // 新增项目中所有区域的数据
        addAllBusinessData: [], // 新增项目中所有的商圈数据
        addProjectUrl: [], // 新增项目上传的图片地址
        projectPictureList: [], // 新增项目时的图片数组对象
        addPlatform: [], // 同步系统中选中的值
        dictionary: {},
        dictionaryList: [111, 117, 350, 359, 123, 126, 145, 208, 135, 149, 160, 129],
        dataRange: [], //时间范围
        staffSearch: [],
        cityList: [], //所有城市信息
        allCity: [],
        allArea: [],
        allBusiness: [],
        cityMessage: { //临时存放当前选择的城市信息
          provinceId: '',
          cityId: '',
          areaId: '',
          businessDistrictId: ''
        },
        cityDetails: [], //用于拼接otherInfo字段
        coverPhoto: '',
        gallery: { //项目明细图片
          kind: 1,
          galleryList: []
        },
        uploadType: 1, //上传
        galleryActive: '',
        deleteRowId: 0,
        editProject_title:"",
        selectWeight: [false, false, false, false, false, false, false],//选择框选中时字体加粗
        /** 户型图弹窗js start */
        // houseTypeVisible:true,
        /** 户型图弹窗js end */
      };
    }, 
    created() {
      this.houseTypeVisible = false
      axios.get("/api/buildingList/can").then(res => {
        if (res.status === 200) {

          this.getAllStatusType()
          this.getAllCity()
          this.keyWordForm = this.defaultKeyWord()
          this.keyWordForm.commercialInfo = JSON.parse(localStorage.getItem("myInfo")).companyId || -1
          getMyCompany().then(res => {
            this.keyWordCompany = res.data
            let isCompanyItem = false
            let infoObj = JSON.parse(localStorage.getItem("myInfo"))
            if (infoObj.dep.isCompany) {
              this.keyWordCompany.forEach(val => {
                if (val.d_id === infoObj.companyId)
                  isCompanyItem = true
              })
              isCompanyItem ? "" : this.keyWordCompany.push({
                "d_id": infoObj.companyId,
                "name": infoObj.companyName
              })
              this.keyWordForm.commercialInfo = infoObj.companyId
            }
            console.log(res);
          })
          this.getAllProvinceList()
          this.getTableList()
        }
      }).catch(err => {
        if (err.response.status === 403) {
          this.$router.push({
            name: "403errorPage"
          })
          return
        }
      })
    },
    methods: {
      //初始化表单对象
      initFormData: function () {
        let obj = {
          projectType: "",
          projectState: "",
          name: "",
          provinceId: "",
          cityId: "",
          areaId: "",
          businessDistrictId: "", // 商区
          buildingPrice: '',
          address: "",
          coordinate: "", // 地图坐标
          statusSell: "", //  是否上架
          buildingProperty: "", // 楼盘性质
          platform: [], // 同步系统
          customerType: "", // 项目有效类型
          moneyDes: "", // 佣金
          proTimeAgentReport: "", //  报备保护期
          reportRule: "", //   报备规则
          proTimeAgentLook: "", //  带看保护期
          proTimeDownPayment: "", //   下定保护期
          dialogImageUrl: "",
          projectPictureList: [],
          otherInfo: "",
          moneyUnit: "",
          timeOfEnd: "",
          lowerFrame: false
        }
        this.cityDetails = []
        this.coverPhoto = ''
        this.addForm = Object.assign({}, this.addForm, obj)
      },
      //上传图片
      upLoadImage(e) {
        let _that = this
        const file = e.target.files[0];

        if (!file) {
          return;
        }

        new ImageCompressor(file, {
          quality: .9,
          maxWidth: 2000,
          maxHeight: 2000,
          success(result) {
            // debugger
            const formData = new FormData();

            formData.append('file', result, result.name);
            formData.append("watermark", false)

            // Send the compressed image file to server with XMLHttpRequest.
            if (result.size > 1 * 1024 * 1024 || result.size < 3 * 1024) {
              _that.$message('图片大小要在3K~1M之间')
              return
            } else {
              _that.$ajax.post('/img/upload', formData).then(res => {
                res = res.data
                if (res.images && res.images.length > 0) {
                  if (res.images[0].src !== 'file size is too small') {
                    let item = {
                      kind: 1,
                      imgUrl: res.images[0].src
                    }
                    if (_that.uploadType === 1) {
                      _that.addForm.projectPictureList.push(item)
                    } else if (_that.uploadType === 2) {
                      _that.upLoadImageOne(item)
                    }
                  }
                }
              })
            }
          },
          error(e) {
            console.log(e.message);
          },
        });

        /*let uploadImg = e.target.files[0]
        let param = new FormData()
        param.append('img',uploadImg)
        param.append("watermark", false)
        //this.$axios.post(url,param).then(res=>{
        this.$ajax.post('/img/upload',param).then(res=>{
          res=res.data
          if(res.images&&res.images.length>0){
            if(res.images[0].src!=='file size is too small'){
              let item = {
                kind:1,
                imgUrl:res.images[0].src
              }
              if(this.uploadType===1){
                this.addForm.projectPictureList.push(item)
              }else if(this.uploadType===2) {
                this.upLoadImageOne(item)
              }
            }
          }
        })*/
      },
      defaultKeyWord() {
        const keyWordFormDate = {
          businessDistrictId: '',
          cityId: "",
          provinceId: "",
          areaId: "",
          projectState: "",
          projectType: "",
          keyword: "",
          commercialInfo: -500
        }
        return keyWordFormDate
      },
      //单独上传
      upLoadImageOne: function (item) {
        let param = {
          bId: this.rowExpand.id,
          imgUrl: item.imgUrl,
          kind: this.gallery.kind
        }
        this.$ajax.post('/api/buildingImage', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.getProImages(this.gallery.kind)
          }
        })
      },
      //单独删除
      delImageOne: function (item) {
        let param = {
          id: item.imgId
        }
        this.$ajax.delete('/api/buildingImage', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.getProImages(this.gallery.kind)
          }
        })
      },
      //单独设置封面
      coverImageOne: function (item) {
        let param = {
          id: this.rowExpand.id,
          coverPhoto: item.img_url
        }
        this.$ajax.putJSON('/api/coverPhoto', param, 2).then(res => {
          res = res.data
          if (res.status === 200) {
            this.getProImages(this.gallery.kind)
          }
        })
      },
      //对上传图片的操作
      uploadImageOpera: function (item, type = 'init') {
        if (type === 'init') {
          this.coverPhoto = item.imgUrl
          if (this.uploadType === 1) {
            this.$set(this.addForm, 'coverPhoto', item.imgUrl)
          } else {
            this.$set(this.editDialogform, 'coverPhoto', item.imgUrl)
          }
        } else {
          if (this.uploadType === 1) {
            this.addForm.projectPictureList.forEach((val, index) => {
              if (val.imgUrl === item.imgUrl) {
                this.addForm.projectPictureList.splice(index, 1)
                if (this.coverPhoto === item.imgUrl && this.addForm.coverPhoto) {
                  delete this.addForm.coverPhoto
                  this.coverPhoto = ''
                }
              }
            })
          } else {
            this.editDialogform.projectPictureList.forEach((val, index) => {
              if (val.imgUrl === item.imgUrl) {
                this.editDialogform.projectPictureList.splice(index, 1)
                if (this.coverPhoto === item.imgUrl && this.editDialogform.coverPhoto) {
                  delete this.editDialogform.coverPhoto
                  this.coverPhoto = ''
                }
              }
            })
          }
        }
      },
      toUpload: function (type) {
        if (type === 1) {
          this.uploadType = 1
          this.$refs.upload.click()
        } else {
          this.uploadType = 2
          this.$refs.upload1.click()
        }
      },
      projectPrice() {
        if (!isProjectPrice(this.addForm.buildingPrice)) {
          this.alertMessage("warning", "项目价格格式不正确")
          return false
        }
      },
      //新增项目
      addPro: function () {
        let coor = this.addForm.coordinate.split(',')
        if (coor.length !== 2 || !coor[1]) {
          this.alertMessage("warning", "请输入正确的地图坐标")
        } else {
          this.submitForm('addForm').then(res => {
            let param = Object.assign({}, this.addForm)
            param.platform = this.getPlatformNum(param.platform)
            param.lowerFrame ? "" : param.lowerFrame = false
            param.otherInfo = this.cityDetails.join(',')
            console.log(param);
            this.$ajax.postJSON('/api/building', param).then(res => {
              res = res.data
              if (res.status === 200) {
                this.dialogAddFormVisible = false
                this.alertMessage("success", "新增成功")
                this.getTableList()
                this.initFormData()
              } else {
                this.alertMessage("warning", res.message)
                return
              }
            })
          }).catch(error => {
            let toastMsg = this.rules[Object.keys(error)[0]][0].message
            this.$message(toastMsg)
          })
        }
        /*let obj={
          projectType: "",
          projectState: "",
          name: "",
          provinceId: "",
          cityId: "",
          areaId: "",
          businessDistrictId: "",  // 商区
          buildingPrice: '',
          address: "",
          coordinate: "", // 地图坐标
          statusSell: "",    //  是否上架
          buildingProperty: "",  // 楼盘性质
          platform: [],    // 同步系统
          customerType: "",   // 项目有效类型
          moneyDes: "",    // 佣金
          proTimeAgentReport: "",  //  报备保护期
          reportRule: "",        //   报备规则
          proTimeAgentLook: "",   //  带看保护期
          proTimeDownPayment: "",  //   下定保护期
          dialogImageUrl: "",
          projectPictureList: [],
          otherInfo: "",
        }*/
      },
      // 关闭模态窗
      handleClose: function (done) {
        // this.cityList = []
        this.clearCityList()
        this.expands = []
        this.SearchStatisticsForm = {
          buildingId: 0,
          day: 5,
          startTime: '',
          endTime: '',
          type: 1,
          pageSize: 5,
          pageNum: 1
        }
        this.statisticsTable = {
            type: 1,
            employeeName: "报备人",
            time: "报备提交时间",
            state: "报备状态",
            info: "报备",
            valid: "有效报备",
            unit: "位",
            amount: "认筹金额"
          },
          this.currentPhase = "全部"
        this.stateTJShow = true
        this.amountTJShow = false
        this.hadUnsubscribeShow = false
        this.dataRange = []
        done()
      },
      //获取所有城市
      getAllCity: function () {
        getAllProvince().then(res => {
          this.cityList = res.data
          console.log(res);
        })
      },
      // 获取选项栏数据
      getAllStatusType() {
        getAllProjectST({
          params: {
            ids: this.dictionaryList.join(',')
          }
        }).then(res => {
          if (res.status === 200) {
            this.dictionary = Object.assign({}, this.dictionary, res.data)
          }
          this.projectStatusData = res.data["117"].children
          this.projectTypeData = res.data["111"].children
          console.log(res);
        })
      },
      // 获取所有省份
      getAllProvinceList() {
        getTargetPlaceInfo({
          params: this.getTargetPlaceData
        }).then(res => {
          this.allProvinceData = res.data
        })
        let strPriCity = ""
        let provinceId = 0
        let cityId = 0
        let isProvince = false
        let proObj = JSON.parse(localStorage.getItem("myInfo")).dep
        if (proObj.isCompany) {
          provinceId = proObj.province
          cityId = proObj.area
          strPriCity = proObj.areaName
          if (strPriCity) {
            this.allProvinceData.forEach(val => {
              if (val.provinceId === provinceId) {
                isProvince = true
              }
            })
            isProvince ? "" : this.allProvinceData.push({
              "province": strPriCity.split(",")[0],
              "provinceId": provinceId
            })
            this.allCityData = [{
              "city": strPriCity.split(",")[1],
              "cityId": cityId
            }]
            this.keyWordForm.cityId = cityId
            this.keyWordForm.provinceId = provinceId
          }
        }
      },
      // 获取表格内容
      getTableList() {
        this.keyWordForm.pageNum = this.pageNum
        this.keyWordForm.pageSize = this.pageSize
        console.log(this.keyWordForm);
        getProjectTableList({
          params: this.keyWordForm
        }).then(res => {
          if (res.status === 200) {
            console.log(res.data.list);
            this.count = res.data.total
            this.tableData = res.data.list;
          } else if (res.status === 403) {
            this.$router.push({
              name: "403errorPage"
            })
            return
          }
        })
      },
      // 编辑操作
      toEdit: function (title) {
        // debugger
        this.editProject_title = title
        axios.put("/api/building/can").then(res => {
          if (res.status === 200) {
            this.detailVisible = false
            this.EditVisible = true
            this.$set(this.editDialogform, 'features', this.bitOpera1(this.dictionary['149'].children, activeItem.features))
            this.$set(this.editDialogform, 'infrastructure', this.bitOpera1(this.dictionary['160'].children, activeItem.infrastructure))
            this.$set(this.editDialogform, 'platform', this.bitOpera1(this.dictionary['145'].children, activeItem.platform))
            this.$set(this.editDialogform, 'buildingType', this.bitOpera1(this.dictionary['135'].children, activeItem.buildingType))
            //请求城市的所有接口
            this.addProvinceChange(this.editDialogform.provinceId, 'init')
            this.addCityChange(this.editDialogform.cityId, 'init')
            this.addAreaChange(this.editDialogform.areaId, 'init')
            this.businessChange(this.editDialogform.businessDistrictId, 'init')
          }
        }).catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限")
            return
          }
        })
      },
      onExport() {
        //导出按钮
      },
      // 单击每行事件
      rowClick(row, event, column) {
        // debugger
        //点击表格行 展开
        let index = this.expands.indexOf(row.id);
        if (index > -1) {
          this.expands = this.expands.splice(index, -1);
        } else {
          this.expands = [];
          this.expands.push(row.id);
        }
        getProjectTableRowInfo({
          params: {
            id: row.id
          }
        }).then(res => {
          if (res.status === 200) {
            this.rowExpand = Object.assign({}, this.rowExpand, res.data)
            this.editDialogform = Object.assign({}, this.rowExpand, res.data)
            activeItem = res.data
            this.$set(this.editDialogform, 'coordinate', `${res.data.longitude},${res.data.latitude}`) //跟进返回的经纬度创建地图坐标字段
          }
        })
      },
      //控制只显示当前一行
      showDetail(rowdata, expandedRows) {
        if (expandedRows.length) {
          this.expands = [];
          if (rowdata) {
            this.expands.push(rowdata.id);
          }
        } else {
          this.expands = [];
        }
      },
      // 新增表单 模态框
      /*submitAddForm(formName) {
        let param = Object.assign({}, this.addForm)
        param.platform = this.getPlatformNum(param.platform)
        this.$ajax.postJSON('/api/building', param).then(res => {
          debugger
        })
        /!*this.$refs[formName].validate(valid => {
          if (valid) {
            let platformNum;
            this.projectPictureList = []
            platformNum = this.addPlatform.length == 1 ? this.addPlatform[0] : (this.addPlatform.length == 2 ?
              this.addPlatform[0] | this.addPlatform[1] : this.addPlatform[0] | this.addPlatform[1] | this.addPlatform[2])
            this.addForm.platform = platformNum
            console.log(this.addProjectUrl);
            this.addProjectUrl.forEach(value => {
              this.projectPictureList.push({"kind": 0, "imgUrl": value})
            })
            console.log(this.projectPictureList);
            this.addForm.projectPictureList = this.projectPictureList
            this.addAllProvinceData.forEach(value => {
              if (value.ID == this.addForm.provinceId) {
                this.otherInfo = value.ProvinceName
                value.CityList.forEach(val => {
                  if (val.CityID == this.addForm.cityId) {
                    this.otherInfo += "," + val.CityName
                    return
                  }
                })
              }
            })
            this.addAllAreaData.forEach(value => {
              if (value.ID == this.addForm.areaId) {
                this.otherInfo += "," + value.AreaName
                return
              }
            })
            this.addAllBusinessData.forEach(value => {
              if (value.ID == this.addForm.businessDistrictId) {
                this.otherInfo += "," + value.ShangQuanName
                return
              }
            })
            this.addForm.otherInfo = this.otherInfo
            console.log(this.addForm);
            addNewProject(this.addForm).then(res => {
              if (res.status === 200) {
                this.alertMessage("success", "新增成功")
                this.dialogAddFormVisible = false
              } else {
                this.alertMessage("warning", "新增失败")
              }
              console.log(res);
            })


          } else {
            this.alertMessage("success", "请完善表单");
            console.log("error submit!!");
            return false;
          }
        })*!/
      },*/
      //或位运算
      getPlatformNum: function (arr) {
        // debugger
        let leng = arr.length
        if (leng === 1) {
          return arr[0]
        }
        if (leng === 2) {
          return arr[0] | arr[1]
        } else {
          let val = arr[0] | arr[1]
          arr = arr.slice(2)
          arr.unshift(val)
          return this.getPlatformNum(arr)
        }
      },
      //与位运算
      bitOpera1: function (arr, num) {
        //debugger
        let newArr = []
        arr.forEach(item => {
          let bit = item.key & num
          if (item.key === bit) {
            newArr.push(item.key)
          }
        })
        return newArr
      },
      // 提交 项目编辑 模态框的所有tab切换表单
      submitEditForm() {
        // debugger
        let coor = this.editDialogform.coordinate.split(',')
        if (coor.length !== 2 || !coor[1]) {
          this.alertMessage("warning", "请输入正确的地图坐标")
        } else {
          this.submitForm('editForm').then(res => {
            let param = Object.assign({}, this.editDialogform)
            param.platform = this.getPlatformNum(param.platform)
            param.features = this.getPlatformNum(param.features)
            param.infrastructure = this.getPlatformNum(param.infrastructure)
            param.buildingType = this.getPlatformNum(param.buildingType)
            param.otherInfo = this.cityDetails.join(',')
            // if(!addForm.coordinate.split("").indexOf(",")){
            //   debugger
            //   this.alertMessage("warning", "地图坐标格式不正确")
            //   return false
            // }
            this.$ajax.putJSON('/api/building', param).then(res => {
              res = res.data
              if (res.status === 200) {
                // debugger
                this.getTableList()
                this.alertMessage("success", "编辑成功")
                getProjectTableRowInfo({
                  params: {
                    id: this.rowExpand.id
                  }
                }).then(res => {
                  if (res.status === 200) {
                    // debugger
                    this.rowExpand = Object.assign({}, this.rowExpand, res.data)
                    this.editDialogform = Object.assign({}, this.rowExpand, res.data)
                    activeItem = res.data
                    this.$set(this.editDialogform, 'coordinate', `${res.data.longitude},${res.data.latitude}`)
                  }
                })
                this.EditVisible = false
                this.expands = []
                this.clearChoseCityMsg()
              } else {
                this.alertMessage("warning", res.message)
                return
              }
            })
          }).catch(error => {
            let toastMsg = this.rules[Object.keys(error)[0]][0].message
            this.$message(toastMsg)
          })
        }
      },
      // 项目统计 模态框
      getProjectStatistics(type) {
        this.SearchStatisticsForm.buildingId = this.rowExpand.id
        let param = {
          buildingId: this.rowExpand.id,
          day: 5,
          endTime: '',
          startTime: '',
          type: 1,
          pageSize: 5,
          pageNum: 1
        }
        if (type === 'info') {
          this.SearchStatisticsForm.startTime = this.dataRange ? this.dataRange[0] : ''
          this.SearchStatisticsForm.endTime = this.dataRange ? this.dataRange[1] : ''
        }
        this.statisticsVisible = true;
        getProjectStatistics({
          params: type === 'init' ? param : this.SearchStatisticsForm
        }).then(res => {
          // debugger
          if (res.status === 200) {
            this.statisticsTableData = res.data
            this.countSum = res.data.total
          }
          let type = this.SearchStatisticsForm.type
          this.statisticsTableData.list.forEach(value => {
            if (type === 1 || type === 2) {
              value.time = value.time ? value.time.slice(0, value.time.lastIndexOf(':')) : ""
              value.money = value.money ? value.money + "元" : ""
            } else if (type === 5 || type === 6) {
              value.time = value.time ? value.time.slice(0, value.time.lastIndexOf(' ')) : ""
              value.money = value.money ? value.money + "万元" : ""
            } else {
              value.time = value.time ? value.time.slice(0, value.time.lastIndexOf(' ')) : ""
              value.money = value.money ? value.money + "元" : ""
            }
          })
          switch (type) {
            case 1:
              this.statisticsCount = {
                valid: this.statisticsTableData.buildingValidReportSum
              }
              break
            case 2:
              this.statisticsCount = {
                valid: this.statisticsTableData.buildingValidLookSum
              }
              break
            case 3:
              this.statisticsCount = {
                valid: this.statisticsTableData.buildingPrcMoneySum
              }
              break
            case 4:
              this.statisticsCount = {
                valid: this.statisticsTableData.buildingSubscribeMoneySum
              }
              break
            case 5:
              this.statisticsCount = {
                valid: this.statisticsTableData.buildingInitialMoneySum
              }
              break
            case 6:
              this.statisticsCount = {
                valid: this.statisticsTableData.buildingNetSignMoneySum
              }
              break
            case 7:
              this.statisticsCount = {
                valid: this.statisticsTableData.unsubscribePrcMoneySum,
                return: this.statisticsTableData.hadUnsubscribePrcSum
              }
              break
            case 8:
              this.statisticsCount = {
                valid: this.statisticsTableData.unsubscribeMoneySum,
                return: this.statisticsTableData.hadUnsubscribeSum
              }
              break
          }
        })
      },
      // 项目统计模态框中的 搜索 按钮
      searchStatistics() {
        console.log(this.SearchStatisticsForm)
        this.SearchStatisticsForm.pageNum = 1
        this.SearchStatisticsForm.pageSize = 5
        let TJData = [{
            type: 1,
            employeeName: "报备人",
            time: "报备提交时间",
            state: "报备状态",
            info: "报备",
            valid: "有效报备",
            unit: "位"
          },
          {
            type: 2,
            employeeName: "带看人",
            time: "带看提交时间",
            state: "带看状态",
            info: "带看",
            valid: "有效带看",
            unit: "位"
          },
          {
            type: 3,
            employeeName: "（认筹）成交人",
            time: "认筹时间",
            state: "认筹金额",
            info: "认筹",
            valid: "认筹金额共",
            unit: "元",
            amount: "认筹金额"
          },
          {
            type: 4,
            employeeName: "（认购）成交人",
            time: "认购时间",
            state: "认筹金额",
            info: "认购",
            valid: "认购金额共",
            unit: "元",
            amount: "认购金额"
          },
          {
            type: 5,
            employeeName: "（草签）成交人",
            time: "草签时间",
            state: "房屋总价",
            info: "草签",
            valid: "房屋总价共",
            unit: "万元",
            amount: "房屋总价"
          },
          {
            type: 6,
            employeeName: "（网签）成交人",
            time: "网签时间",
            state: "房屋总价",
            info: "网签",
            valid: "房屋总价共",
            unit: "万元",
            amount: "房屋总价"
          },
          {
            type: 7,
            employeeName: "退筹申请人",
            time: "退筹时间",
            amount: "退筹金额",
            state: "退筹状态",
            info: "退筹",
            valid: "退筹金额共",
            unit: "元",
            msg: "已退筹"
          },
          {
            type: 8,
            employeeName: "退房申请人",
            time: "退房时间",
            amount: "退款金额",
            state: "退房状态",
            info: "退房",
            valid: "退款金额共",
            unit: "元",
            msg: "已退房"
          },
        ]
        if (this.SearchStatisticsForm.type === 1 || this.SearchStatisticsForm.type === 2) {
          this.amountTJShow = false
        } else {
          this.amountTJShow = true
        }
        if (
          this.SearchStatisticsForm.type === 1 ||
          this.SearchStatisticsForm.type === 2 ||
          this.SearchStatisticsForm.type === 7 ||
          this.SearchStatisticsForm.type === 8) {
          this.stateTJShow = true
        } else {
          this.stateTJShow = false
        }
        if (this.SearchStatisticsForm.type === 7 || this.SearchStatisticsForm.type === 8) {
          this.hadUnsubscribeShow = true
        } else {
          this.hadUnsubscribeShow = false
        }
        TJData.forEach(value => {
          if (this.SearchStatisticsForm.type === value.type) {
            this.statisticsTable = value
          }
        })
        switch (this.SearchStatisticsForm.day) {
          case 1:
            this.currentPhase = "当天"
            break
          case 2:
            this.currentPhase = "七天内"
            break
          case 3:
            this.currentPhase = "本月"
            break
          case 4:
            this.currentPhase = "半年"
            break
          case 5:
            this.currentPhase = "全部"
            break
        }
        this.getProjectStatistics('info')
      },
      // 双击行展开
      rowDblclick(row, event) {
        // this.rowDblclickId = row.id
        console.log("OKKK");
        console.log(row, event);
        this.detailVisible = true;
        this.getStaff(this.rowExpand.id)
        this.getOperationRecord(this.rowExpand.id)
        this.getProImages()
      },
      // 获取项目明细人员列表
      getStaff: function (id) {
        let param = {
          id: id
        }
        this.$ajax.get('/api/itemMemberByBuildingId', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.personTableData = res.data
          }
        })
      },
      // 明细图片
      getProImages: function (type = 1) {
        let param = {
          id: this.rowExpand.id,
          kind: type
        }
        this.gallery.kind = type
        this.$ajax.get('/api//buildingImageByBuildingId', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.gallery.galleryList = res.data
          }
        })
      },
      // 获取操作记录
      getOperationRecord: function (id) {
        let param = {
          id: id
        }
        this.$ajax.get('/api/projectOperationRecord', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.operateLogTableData = res.data
          }
        })
      },
      // === 新增图片   ===
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePicture(file) {
        this.dialogImageUrl = file.url;
        this.dialogImageVisible = true;
      },
      handlePictureAll(file) {
        this.dialogImageUrl = file.url;
        this.dialogImageVisible = true;
      },
      handlePictureType(file) {
        this.dialogImageUrl = file.url;
        this.dialogImageVisible = true;
      },
      //提交分配人员内层模态框
      submitAllotPersonForm() {
        if (!this.allotPersonForm.name) {
          this.$message('请选择项目驻场')
        } else {
          let param = {
            bId: this.rowExpand.id,
            eId: this.allotPersonForm.id,
            mobileShowMode: this.allotPersonForm.mobileShowMode
          }
          this.$ajax.postJSON('/api/itemMember', param).then(res => {
            res = res.data
            if (res.status === 200) {
              this.personVisible = false
              this.getStaff(this.rowExpand.id)
              let obj = {
                id: '',
                name: "",
                phone: "",
                duty: ""
              }
              this.allotPersonForm = Object.assign({}, this.allotPersonForm, obj)
              this.alertMessage("warning", "分配成功")
            } else {
              this.$message(res.message)
            }
          })
        }
      },
      //取消分配人员
      cancelAllotPersonForm() {
        this.allotPersonForm.name = ""
        this.allotPersonForm.phone = ""
        this.allotPersonForm.duty = ""
        this.personVisible = false
        this.staffSearch = []
      },
      //点击分配人员
      clickPutPerson() {
        this.allotPersonForm.name = ""
        this.staffSearch = []
        this.personVisible = true
      },
      // 获取人员列表
      searchStaff: function () {
        let param = {
          keyword: this.allotPersonForm.name
        }
        this.$ajax.get('/api/getProjectResident', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.staffSearch = res.data
          }
        })
      },
      // 设置项目人员
      setProjectPerson: function (item) {
        this.allotPersonForm.name = item.e_name
        this.allotPersonForm.id = item.e_id
        this.allotPersonForm.phone = item.mobile
        this.allotPersonForm.duty = item.title
        this.staffSearch = []
      },
      // 分配人员操作
      addStaff: function () {

      },
      // 项目统计时间改变时
      projectTimeChange() {
        this.dataRange = []
      },
      // 项目统计自定义时间改变时
      projectTimesChange() {
        this.SearchStatisticsForm.day = 5
      },
      // 传递删除行的index
      confirmDelRowindex(row) {
        this.deleteRowId = row.id
        this.confirmDelVisible = true
        // this.$confirm('是否删除此条数据？', '确认信息', {
        //   distinguishCancelAndClose: true,
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消'
        // }).then(() => {
        //   this.$ajax.delete('/api/itemMember', param).then(res => {
        //     res = res.data
        //     if (res.status === 200) {
        //       this.alertMessage("warning", "删除成功")
        //       this.getStaff(this.rowExpand.id)
        //     }else{
        //       this.alertMessage("warning", res.message)
        //     }
        //   })
        // })
      },
      setPhoneRule(row) {
        this.setPhoneRuleBox = true
        this.setPhoneRuleForm = row
      },
      submitPhoneRule() {
        let params = {}
        params.id = this.setPhoneRuleForm.id
        params.mobileShowMode = this.setPhoneRuleForm.mobile_show_mode
        axios.put("/api/itemMember", params).then(res => {
          if (res.status === 200) {
            if (res.data.status === 200) {
              this.setPhoneRuleBox = false
              this.alertMessage("success", "设置成功")
              this.getStaff(this.rowExpand.id)
            } else {
              this.alertMessage("warning", res.data.message)
            }
          } else {
            this.alertMessage("success", "设置失败")
          }
        })
      },
      // 删除人员分配里的表格行
      confirmDeleteRow(index, rows) {
        let param = {
          id: this.deleteRowId
        }
        this.$ajax.delete('/api/itemMember', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.alertMessage("warning", "删除成功")
            this.getStaff(this.rowExpand.id)
          } else {
            this.alertMessage("warning", res.message)
          }
          this.confirmDelVisible = false;
        })
        // rows.splice(index, 1); // 删除行
      },
      // tab 图库中 全部与户型图 切换
      imgStoreHandleClick(tab, event) {
        console.log(tab, event);
      },
      // 分页器点击每页显示条数变化时
      handleSizeChange(val) {
        this.pageSize = val
        // this.keyWordForm = {
        //   pageNum: this.pageNum,
        //   pageSize: this.pageSize
        // }
        this.getTableList()
      },
      // 分页器点击页面跳转时
      handleCurrentChange(val) {
        // this.keyWordForm = {pageNum: this.pageNum, pageSize: this.pageSize}
        this.pageNum = val
        this.getTableList()
      },
      // 项目统计分页器点击每页显示条数变化时
      handleSizeChangeTJ(val) {
        this.SearchStatisticsForm.pageSize = val
        this.getProjectStatistics('info')
      },
      // 项目统计分页器点击页面跳转时
      handleCurrentChangeTJ(val) {
        this.SearchStatisticsForm.pageNum = val
        this.getProjectStatistics('info')
      },
      // 关键词搜索选择的省份发生改变时
      provinceChange(val) {
        delete this.getTargetPlaceData.cityId
        this.selectWeight[0]=true
        this.getTargetPlaceData.provinceId = val
        this.keyWordForm.cityId = ""
        this.keyWordForm.areaId = ""
        this.keyWordForm.businessDistrictId = ""
        this.keyWordForm.commercialInfo = -500
        this.allAreaData = []
        this.allBusinessData = []
        getTargetPlaceInfo({
          params: this.getTargetPlaceData
        }).then(res => {
          this.allCityData = res.data
        })
        console.log(this.allCityData);
      },
      // 关键词搜索选择城市发生改变时
      cityChange(val) {
        delete this.getTargetPlaceData.areaId
        this.selectWeight[1] = true
        this.getTargetPlaceData.cityId = val
        this.keyWordForm.areaId = ""
        this.keyWordForm.businessDistrictId = ""
        this.keyWordForm.commercialInfo = -500
        this.allBusinessData = []
        getTargetPlaceInfo({
          params: this.getTargetPlaceData
        }).then(res => {
          this.allAreaData = res.data
        })
      },
      // 关键词搜索选择片区改变的时候
      areaChange(val) {
        this.selectWeight[2] = true
        this.keyWordForm.businessDistrictId = ""
        this.keyWordForm.commercialInfo = -500
        delete this.getTargetPlaceData.businessDistrictId
        this.getTargetPlaceData.areaId = val
        getTargetPlaceInfo({
          params: this.getTargetPlaceData
        }).then(res => {
          this.allBusinessData = res.data
        })
      },
      businessDisChange() {
        this.selectWeight[3] = true
        this.keyWordForm.commercialInfo = -500
      },
      companyChange(){
          this.selectWeight[4] = true
      },
      projectStateChange(){
          this.selectWeight[5] = true
      },
      projectTypeChange(){
          this.selectWeight[6] = true
      },
      // 根据输入的关键词查询按钮
      onSearch() {
        this.pageNum = 1
        this.getTableList()
        console.log(this.keyWordForm);
      },
      onReset() {
        // 重置查询条件按钮
        this.pageNum = 1
        this.pageSize = 5
        this.keyWordForm = this.defaultKeyWord()
        this.getTableList()
      },
      addProjectBtn() {
        axios.post("/api/building/can").then(res => {
          if (res.status === 200) {
            this.dialogAddFormVisible = true
            this.initFormData()
            this.getAllCity()
            /*getAllProvince().then(res => {
              this.addAllProvinceData = res.data
              console.log(res);
            })*/
          }
        }).catch(err => {
          if (err.response.status === 403) {
            this.alertMessage("warning", "无操作权限")
            return
          }
        })

      },
      // 省份选择发生改变时，获取城市
      addProvinceChange(val, type = 'edit') {
        if (type === 'edit') {
          //重置下级
          this.addForm.cityId = ''
          this.addForm.areaId = ''
          this.addForm.businessDistrictId = ''
          this.editDialogform.cityId = ''
          this.editDialogform.areaId = ''
          this.editDialogform.businessDistrictId = ''
          this.allArea = []
          this.allBusiness = []
          this.cityDetails = []
        }
        // debugger

        this.cityMessage.provinceId = val
        this.cityList.forEach(value => {
          if (val == value.ID) {
            this.allCity = value.CityList
            this.cityDetails.splice(0, 1, value.ProvinceName)
            return
          }
        })
      },
      // 城市选择发生改变时，获取城市区域
      addCityChange(val, type = 'edit') {
        this.cityMessage.cityId = val
        getAddAreaList({
          params: {
            cityID: val
          }
        }).then(res => {
          this.allArea = res.data
        })
        // debugger
        if (type === 'edit') {
          //重置下级
          this.addForm.areaId = ''
          this.addForm.businessDistrictId = ''
          this.editDialogform.areaId = ''
          this.editDialogform.businessDistrictId = ''
          this.allBusiness = []
          this.cityDetails.splice(1, 3)

          this.allCity.forEach(value => {
            if (val == value.CityID) {
              this.cityDetails.splice(1, 1, value.CityName)
              return
            }
          })
        } else {
          this.cityDetails.splice(1, 1, this.editDialogform.city)
        }
      },
      // 城市区域选择改变时，获取商圈
      addAreaChange(val, type = 'edit') {
        this.cityMessage.areaId = val
        let param = {
          cityID: this.cityMessage.cityId,
          areaID: this.cityMessage.areaId
        }
        getAddBusinessList({
          params: param
        }).then(res => {
          this.allBusiness = res.data
        })
        // debugger
        if (type === 'edit') {
          //重置下级
          this.addForm.businessDistrictId = ''
          this.editDialogform.businessDistrictId = ''
          this.cityDetails.splice(2, 2)
          this.allArea.forEach(value => {
            if (val == value.ID) {
              this.cityDetails.splice(2, 1, value.AreaName)
              return
            }
          })
        } else {
          this.cityDetails.splice(2, 1, this.editDialogform.area)
        }
      },
      businessChange(val, type = 'edit') {
        // debugger
        if (type !== 'edit') {
          this.cityDetails.splice(3, 1, this.editDialogform.businessDistrict)
        } else {
          this.allBusiness.forEach(value => {
            if (val == value.ID) {
              this.cityDetails.splice(3, 1, value.ShangQuanName)
              return
            }
          })
        }
        /*if(this.allBusiness){
          this.allBusiness.forEach(value => {
            if (val == value.ID) {
              this.cityDetails.splice(3,1,value.ShangQuanName)
              return
            }
          })
        }*/
      },
      uploadPhotoSuccess(file) {
        console.log(file);
        this.addProjectUrl.push(file.images[0].src)
        console.log(this.addProjectUrl);
      },
      handlePictureCardPreview(file) {
        // console.log(file);
        // this.dialogImageUrl = file.url;
        // console.log(this.dialogImageUrl);
        // this.dialogVisible = true;
      },
      removeAddPhone(file) {
        this.addProjectUrl.forEach((value, index) => {
          if (value == file.response.images[0].src) {
            this.addProjectUrl.splice(index, 1)
          }
        })
        // console.log(this.addProjectUrl);
      },
      spotFormatter: function (val) {
        if (!val) {
          return '-'
        } else {
          let tip = val.split(',')
          let str = ''
          for (let i = 0; i < tip.length; i++) {
            str += `<span>${tip[i]}</span>`
          }
          return str
        }
      }
    },
    filters: {
      spotFormatter: function (val) {
        if (!val) {
          return '-'
        } else {
          let tip = val.split(',')
          let str = ''
          for (let i = 0; i < tip.length; i++) {
            str += `<span>${tip[i]}</span>`
          }
          return str
        }
      }
    }
  };