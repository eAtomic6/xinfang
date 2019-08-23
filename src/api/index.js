import axios from 'axios'
import Vue from 'vue'
import router from '@/router'
let qs = require('qs')
// const baseURL = 'http://192.168.1.224:18081/v2/api-docs'
// axios.defaults.baseURL = 'api/'
// 消息弹框的封装
let alertMessage = function (type, msg) {
  Vue.prototype.$message({
    type: type,
    message: msg,
    duration: 1000
  });
}
// 请求拦截，每次请求的时候将token返回给服务器
axios.interceptors.request.use(function (config) {
  if (localStorage.getItem('token')) {
    config.headers['token'] = localStorage.getItem('token');
    // config.headers['token'] =  "0a890d48-8be9-4d39-94de-0e61ee1f74e9";
  }
  return config;
}, function (error) {
  throw new Error(error)
  return Promise.reject(error);
});
// 响应拦截，响应状态码为403的时候跳转至无权访问页面
// 响应拦截
axios.interceptors.response.use(response => {
  // debugger
  console.log(response);
  if(response.data.status === 405){
    // debugger
    alertMessage("warning", response.data.message)
    return
  }
  return response
},error => {
    // debugger
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.setItem("checkIsLogin",true)
          localStorage.removeItem("token")
          localStorage.removeItem("myInfo")
          router.push({
            path: "/login"
          })
        break;
        case 404:
          router.push({
            name: "404errorPage"
          })
         break;
        default:
          break
      }
    }
    return Promise.reject(error) // 返回接口返回的错误信息
  }
)

// =============================登录所有接口==============================
// 登录页面获取短信验证码接口
export const getPhoneCode = (params) => {
  return axios.get("/api/captcha", params).then(res => res.data)
}
// 登录页面点击登录按钮请求接口
export const getLoginAdmin = (params) => {
  return axios.get("/api/login", params).then(res => res.data)
}
// ======================组织架构的所有接口==============================
// 获取所有组织架构左边部门列表的接口列表信息的接口
export const getDepartList = (params) => {
  return axios.get("/api/department/list", params).then(res => res.data)
}
// 点击编辑部门时请求的接口
export const editDepartment = (params) => {
  return axios.get("/api/department", params).then(res => res.data)
}
// 确定编辑部门请求接口
export const editDepartmentPut = (params) => {
  return axios.put("/api/department", qs.stringify(params)).then(res => res.data)
}
// 确定新增部门请求接口
export const addDepartment = (params) => {
  return axios.post("/api/department", qs.stringify(params)).then(res => res.data)
}
// 获取所有省、市的请求接口
export const getAllProvince = () => {
  return axios.get("/api/resource/city").then(res => res.data)
}
//  删除部门的请求接口
export const deleteDepartment = (params) => {
  return axios.delete("/api/department", params).then(res => res.data)
}
export const getDeleteDepartNum = (params) => {
  return axios.get("/api/employee/countByTheDepartment", params).then(res => res.data)
}
// 编辑用户的请求接口
export const editUser = (params) => {
  return axios.get("/api/employee", params).then(res => res.data)
}
// 根据指定条件获取对应的员工列表信息
export const getEmployeeList = (params) => {
  return axios.get("/api/employee/list", params).then(res => res.data)
}
// 确定编辑用户请求
export const editUserPut = (params) => {
  return axios.put("/api/employee", qs.stringify(params)).then(res => res.data)
}
// 确定添加用户请求
export const addUser = (params) => {
  return axios.post("/api/employee", qs.stringify(params)).then(res => res.data)
}
//  获取点击权限管理时的权限列表信息的接口
export const getManageInfo = () => {
  return axios.get("/api/func/role").then(res => res.data)
}
// 获取点击权限列表编辑权限，确定编辑时的请求接口
export const editPermisePut = (params) => {
  return axios.put("/api/func/role", qs.stringify(params)).then(res => res.data)
}
// 点击设置权限时，跳转至权限设置页面列表信息展示请求
export const getSetPermiseInfo = (params) => {
  return axios.get("/api/func", params).then(res => res.data)
}
// 点击保存确认修改权限
export const setPermisePut = (params) => {
  // return axios.put("/api/func", JSON.stringify(params)).then(res => res.data)
  return axios.put("/api/func", qs.stringify(params)).then(res => res.data)
}
// 获取点击权限列表新增权限，确定新增时的请求接口
export const addPermise = (params) => {
  return axios.post("/api/func/role", qs.stringify(params)).then(res => res.data)
}
// 获取所以管辖部门的请求接口
export const getAdminDept = (params) => {
  return axios.get("/api/resource/uplusDepart", params).then(res => res.data)
}
// 查询所有的私客数量
export const getPersonEmployee = (params) => {
  return axios.get("/api/employee/custCount", params).then(res => res.data)
}
// 私客掉公的弹框
export const employeeDrop = (params) => {
  return axios.post("/api/department/company/config", qs.stringify(params)).then(res => res.data)
}
// 批量转移员工的数据请求
export const moveEmployeePut = (params) => {
  return axios.put("/api/employee/transfer", qs.stringify(params)).then(res => res.data)
}
// 上传公司logo
export const uploadLogoPut = (params) => {
  return axios.put("/api/department/logo", qs.stringify(params)).then(res => res.data)
}
// 新增banner时，获取所有已上架的项目列表
export const getProjectListInfo = (params) => {
  return axios.get("/api/appProjectSearch", params).then(res => res.data)
}
// ======================获取个人信息接口==============================
// 登录成功请求个人信息接口，获取个人信息
export const getPersonInfo = () => {
  return axios.get("/api/personal/me").then(res => res.data)
}

// 修改编辑头像的请求接口
export const editHeadImg = (params) => {
  return axios.put("/api/personal/headImg", qs.stringify(params)).then(res => res.data)
}
// 退出企业
export const dropCompany = (params) => {
  return axios.delete("/api/personal/leaving", params).then(res => res.data)
}
// ======================数据字典所有接口================================================
// 获取数据字典左边数据的请求接口
export const getParentDictionary = (params) => {
  return axios.get("/api/dictionary", params).then(res => res.data)
}
// 添加字典或字典项
export const addDictionary = (params) => {
  return axios.post("/api/dictionary", qs.stringify(params)).then(res => res.data)
}
export const editDictionary = (params) => {
  return axios.put("/api/dictionary", qs.stringify(params)).then(res => res.data)
}
// ======================banner管理所有接口===================================================
// 获取说有banner列表信息接口请求
export const getBannerList = (params) => {
  return axios.get("/api/banner/list", params).then(res => res.data)
}
// 点击上架下架时请求的接口
export const operationInfo = (params) => {
  return axios.put("/api/banner/operate", qs.stringify(params)).then(res => res.data)
}

// 新增banner请求接口
export const addBannerPut = (params) => {
  return axios.post("/api/banner", qs.stringify(params)).then(res => res.data)
}

// 新增banner请求接口
export const getAllCompantInfo = (params) => {
  return axios.get("/api/department/company/list", params).then(res => res.data)
}
// ======================公告管理所有接口===================================================

// 获取公告列表信息的请求接口
export const getAnnounceList = (params) => {
  return axios.get("/api/notice/list", params).then(res => res.data)
}
// 删除指定id的公告
export const deleteAnnounce = (params) => {
  return axios.delete("/api/notice", params).then(res => res.data)
}
// 根据id查看公告详情
export const getAnnounceInfo = (params) => {
  return axios.get("/api/notice", params).then(res => res.data)
}
// 新增公告
export const addAnnounceInfo = (params) => {
  return axios.post("/api/notice", qs.stringify(params)).then(res => res.data)
}

// 获取未读公告的数量
export const getNoReadNum = () => {
  return axios.get("/api/notice/count", ).then(res => res.data)
}
// ======================项目列表的所有接口========================================================
// 获取 项目列表中 表格信息的接口
export const getProjectTableList = (params) => {
  return axios.get("/api/buildingList", params).then(res => res.data)
}
export const getMyCompany = (params) => {
  return axios.get("/api/getItemCompany", params).then(res => res.data)
}
// 查询项目所在的所有的省份
export const getTargetPlaceInfo = (params) => {
  return axios.get("/api/projectProvinceCityAreaBusinessDistrict", params).then(res => res.data)
}
// 查询所有的项目类型和项目状态
export const getAllProjectST = (params) => {
  return axios.get("/api/dictionary/list", params).then(res => res.data)
}

// 新增项目中根据城市id获取相应的区域
export const getAddAreaList = (params) => {
  return axios.get("/api/resource/area", params).then(res => res.data)
}

// 新增项目中根据对应的城市id和区域id获取商圈列表
export const getAddBusinessList = (params) => {
  return axios.get("/api/resource/shangquan", params).then(res => res.data)
}
// 点击确认新增项目时的请求数据
export const addNewProject = (params) => {
  return axios.post("/api/building", params).then(res => res.data)
}
// 项目 单击表格行 展开数据
export const getProjectTableRowInfo = (params) => {
  return axios.get("/api/buildingById", params).then(res => res.data)
}
// 项目 展开行 点击统计 请求项目统计接口
export const getProjectStatistics = (params) => {
  return axios.get("/api/buildingStatistics", params).then(res => res.data)
}

// ======================合同管理的所有接口==============================
//合同管理的table列表
export const contractManagement = (params) => {
  return axios.get("/api/deal/list", params).then(res => res.data)
}
//合同管理列表的单击
export const contractManagementClick = (params) => {
  return axios.get("/api/deal/contractDetails", params).then(res => res.data)
}
//获取员工跟对应部门列表信息请求接口
export const getEmployeeInfo = (params) => {
  return axios.get("/api/employee/find", params).then(res => res.data)
}

//分佣
export const postCommission = (params) => {
    let jsonParam = JSON.stringify(params)
    let headers = {
    post: {}
    }
    headers.post['Content-Type'] = 'application/json'
  return axios.post("/api/deal/commission", jsonParam, {headers: headers}).then(res => res.data)
}

//合同页面表格双击合同明细数据
export const getContractInfo = (params) => {
  return axios.get("/api/deal/contractInfo", params).then(res => res.data)
}

//合同管理列表中的结算表单提交
export const settlementClick = (params) => {
  return axios.put("/api/deal/settlement", qs.stringify(params)).then(res => res.data)
}
//合同管理列表中的结算详情
export const settlementDetailsClick = (params) => {
  return axios.get("/api/deal/settlementDetails", params).then(res => res.data)
}
