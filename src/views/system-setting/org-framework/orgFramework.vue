<!-- 组织机构 -->
<template>
<div class="org_container container">
  <div class="left_Content">
    <!-- 左边树状结构 -->
    <div class="org_leftTree">
      <el-tree
      :data="departDataList"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :props="defaultProps"
      >
      <span class="custom-tree-node" slot-scope="{ data }">
        <span class="listContent" @click="getEmployeeInfo(data)">{{ data.name }}</span>
        <el-dropdown trigger="click" class="orgLeft-setBox">
          <i class="icon icon-shezhi orgLeft-icon" @click="editIcon(data)"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="editDepartBtn(data)"><i class="icon icon-bianji"></i>编辑部门 </el-dropdown-item>
            <el-dropdown-item @click.native="deleteDepartBtn(data)"><i class="el-icon-delete"></i> 删除部门</el-dropdown-item> 
            <el-dropdown-item @click.native="addDepartBtn(data)"><i class="icon icon-addNew"></i> 新增部门</el-dropdown-item>
            <el-dropdown-item @click.native="addUserBtn(data)"><i class="icon icon-addNew"></i>新增用户</el-dropdown-item>
            <el-dropdown-item @click.native="uploadLogo(data)" v-show="isUploadLogo"><i class="icon icon-shangchuan"></i> 上传logo</el-dropdown-item>
            <el-dropdown-item @click.native="addBanner(data)" v-show="isAddBanner"><i class="icon icon-addNew"></i> 新增banner</el-dropdown-item>
             <el-dropdown-item @click.native="setEmpDropTime(data)" v-show="isAddBanner"><i class="icon icon-bianji"></i>公司配置设置</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
      </span>
    </el-tree>
    </div>
  </div>
  <div class="right_Content">
     <!-- 头部form表单 -->
     <div class="w-select">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="状态:">
              <el-select v-model="formInline.status" placeholder="全部" class="selectIpt">
                <!-- 秦星星加22375 bug -->
                 <el-option label="全部" value=""></el-option>
                <el-option label="在职" :value=1></el-option>
                <el-option label="离职" :value=2></el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="关键词:">
            <el-input v-model="formInline.keyword" placeholder="关键词"></el-input>
          </el-form-item>
          <el-form-item>
            <button type="button" @click="onSearch" class="searchBtn">搜索</button>
          </el-form-item>
          <el-form-item>
            <button type="button" @click="onReset" class="resetBtn">重置</button>
          </el-form-item>
          <el-form-item>
            <button type="button" @click="addUserBtn" class="addIpt"><span class="icon icon-addNew org-icon"></span>新增用户</button>
          </el-form-item>
          <el-form-item>
            <button type="button" @click="onExport" class="piliangBtn"><span class="icon icon-setting org-icon"></span>批量操作</button>
          </el-form-item>
          <el-form-item>
            <button type="button" @click="permissManage" class="adminBtn"><span class="icon icon-setting org-icon"></span>权限管理</button>
          </el-form-item>
        </el-form>
     </div>
    <!-- 头部当前显示信息 -->
    <div class="nowAdress">
        <span>当前部门 : <b> {{departmentMsg}}</b> </span>
        <span>公司属性 : <b> {{companyType}}</b> </span>
    </div>
  <!-- 员工列表信息table表格 -->
  <el-table
    ref="multipleTable"
    :data="userDataList"
    tooltip-effect="dark"
    @row-click="tableRowClick"
    @select="checkSelect"
    style="width: 100%;"
    heigth='250'
    border
    @selection-change="handleSelectionChange"
    >
    <el-table-column
      type="selection"
      prop='isDepMaster'
      width="50">
    </el-table-column>
    <el-table-column
      label="序号"
      width="60"
      type="index">
      <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
    </el-table-column>
    <el-table-column
      label="姓名"
      width="150">
      <template slot-scope="scope">
        <span>{{scope.row.name}}<i class="zhuGuan" v-show="scope.row.isDepMaster">主管</i></span>
      </template>
    </el-table-column>
    <el-table-column
      prop="sex"
      label="性别"
      width='60'
      show-overflow-tooltip>
    </el-table-column> 
    <el-table-column
      label="所属公司"
      width='150'
      show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{!scope.row.companyName ? scope.row.depName : scope.row.companyName}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="roleStr"
      label="权限"
      width='120'
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="title"
      label="职务"
       width='120'
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="idcard"
      label="身份证号"
       width='200'
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="手机号"
       width='150'
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
       width='80'
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="joinTime"
      label="入职日期"
       width='180'
      show-overflow-tooltip>
    </el-table-column>
     <el-table-column
      label="操作"
      width="180">
      <template slot-scope="scope">
        <button type="text" class="editData" @click="editUserBtn(scope)">编辑</button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="prev, pager, next,  total, sizes, jumper"
      :total="userListTotal">
    </el-pagination>
  <!-- 分页 -->
  </div>
  <!-- 添加用户弹框 -->
  <div class="org_addUser">
    <el-dialog title="新增用户" :visible.sync="addUserBox">
    <el-form :model="addUserForm" :rules="rules" label-width='100px' :inline=true ref="addUserRuleForm" class="demo-ruleForm">
      <div v-show="isShowBefore">
      <el-form-item label="员工姓名:" prop="name">
        <el-input v-model="addUserForm.name" maxlength=5></el-input>
      </el-form-item>
      <el-form-item label="性 别:">
          <el-select v-model="addUserForm.sex" placeholder="选择性别">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
          </el-select>
      </el-form-item>
        <el-form-item label="身份证号:" prop="idcard">
          <el-input v-model="addUserForm.idcard" @change="idCardChange" maxlength=18></el-input>
      </el-form-item>
      <el-form-item label="入职日期:" prop="joinTime">
          <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="addUserForm.joinTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="出生日期:">
        <el-date-picker type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" v-model="addUserForm.birthday"></el-date-picker>
      </el-form-item>
      <el-form-item label="权 限:" class="rolePermissItem">
       <el-select v-model="addUserRoleShow" placeholder="请选择">
                <el-option value="">
                    <el-tree :data="roleList" 
                    :props="employeeProps"
                    show-checkbox
                    node-key="DepartOnlyCode"
                    :expand-on-click-node=false
                    @check="handleNodeClickRole"
                    ></el-tree>
                </el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="职 务:" >
            <el-input v-model="addUserForm.title" maxlength=10></el-input>
        </el-form-item>
        <el-form-item label="所属部门:">
          <el-input v-model="addUserForm.depName" disabled></el-input>    
          <!-- 秦星星 begin -->
          <!-- <el-input v-model="adminIptValue" disabled></el-input>    -->
          <!-- end -->
        </el-form-item>
        <el-form-item label="管辖部门:" v-show="isShowAdminIpt">
            <el-select v-model="adminIptValue" placeholder="请选择">
            <el-option value="">
                <el-tree :data="adminDeptData"
                :props="adminDeptProp"
                show-checkbox
                node-key="DepartOnlyCode"
                :expand-on-click-node=false
                @check="handleNodeClick"
                style="width: 100%"
                ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
        <el-form-item label="">
          <el-checkbox-group v-model="addUserForm.isDepMaster">
            <el-checkbox label="主管" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        </el-form-item>
      </div>
      <div v-show="isShowNext" class="addUserPhone">
        <el-form-item label="手 机 号:" class="mobileInputBox">
          <el-input v-model="addUserForm.mobile" maxlength=11 @change="addUserPhoneChange"></el-input>
      </el-form-item>
      <el-form-item prop="addUserCaptcha" label="短信验证码:"> 
        <el-input v-model="addUserForm.captcha" placeholder="请输入短信验证码" class="codeIpt"></el-input>
        <div class="getPhoneCd" @click="getPhoneCd" v-show="isShowGet">获取手机验证码</div>
        <div class="getPhoneCd againPhoneCd" v-show="isShowAgain">还剩 <span style="color: #FD8F00">{{againTime}}</span> 秒</div>
      </el-form-item>
      </div>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-show="showBeforeBtn">
          <el-button  @click="addBeforeStep" class="sureAdd" v-show="showBeforeBtn">上一步</el-button>
          <el-button  @click="sureAddUser('addUserRuleForm')" class="sureAdd" v-show="showBeforeBtn">完成</el-button>
        </div>
        <div v-show="showNextBtn">
          <el-button @click="addUserBox = false" class="noAdd">取 消</el-button>
          <el-button  @click="addNextStep('addUserRuleForm')" class="sureAdd" v-show="showNextBtn">下一步</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
  <!-- 编辑用户弹框 -->
  <div class="org_editUser">
    <el-dialog :title="editUserTitle" :visible.sync="editUserBox">
      <div class="newDepartBox" v-show="isShowMove">
          <el-form :model="moveEmpForm" ref="moveForm" label-width="100px" class="demo-ruleForm">
            <el-form-item
            label="新部门："
            :rules="[{required: true, message: '请输入新部门名称', trigger: 'blur' },]"
            >
              <el-select v-model="departName" placeholder="请选择">
                <el-option value="">
                    <el-tree :data="moveEmpData" 
                    :props="moveEmpProp"
                    node-key="DepartOnlyCode"
                    check-on-click-node
                    :expand-on-click-node=false
                    @node-click="clickNode"
                    ></el-tree>
                </el-option>
            </el-select>
            </el-form-item>
              <p class="moveEmployeeDec">你确定将<span style="font-weight:700">{{moveEmployee}}</span><span 
              style="color: #f84949;">{{moveEmployeeNum}}</span>名员工转移至新的部门？</p>
            <div class="move_footer">
              <el-button  @click="sureMoveClick('moveForm')" class="sureAdd">确 定</el-button>
              <el-button @click="noMoveClick('moveForm')" class="noAdd">取 消</el-button>
            </div>
        </el-form>
      </div>
      <el-form :model="editUserData" :rules="rules" label-width='100px' :inline=true ref="eidtUserRuleForm"
       class="demo-ruleForm" v-show="isShowEditUser">
       <div v-show="showEditUserBefore">
        <el-form-item label="员工姓名:" prop="name">
          <el-input v-model="editUserData.name" maxlength=5></el-input>
        </el-form-item>
        <el-form-item label="性 别:">
            <el-select v-model="editUserData.sex" placeholder="选择性别">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="身份证号:" prop="idcard">
            <el-input v-model="editUserData.idcard" @change="idCardChange" maxlength=18></el-input>
        </el-form-item>
        <el-form-item label="入职日期:" >
            <el-date-picker type="date" placeholder="选择日期"
            value-format="yyyy-MM-dd" v-model="editUserData.joinTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="出生日期:">
          <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" format="yyyy-MM-dd"  v-model="editUserData.birthday"></el-date-picker>
        </el-form-item>
        <el-form-item label="状 态" prop="status">
        <el-select v-model="editUserData.status" placeholder="选择权限" @change="statusChange">
          <el-option label="在职" :value="1"></el-option>
          <el-option label="离职" :value="2"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="离职日期:">
          <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="选择日期" v-model="editUserData.leaveTime" @change="dropCompanyTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="权 限" class="rolePermissItem">
          <el-select v-model="editUserRolesShow" placeholder="请选择">
                <el-option value="">
                    <el-tree :data="roleList" 
                    :props="employeeProps"
                    show-checkbox
                    node-key="roleId"
                    :default-checked-keys="defaultEditUser"
                    :expand-on-click-node=false
                    @check="handleNodeClickEditRole"
                    ></el-tree>
                </el-option>
            </el-select>
          <!-- :value="item.roleId" -->
             <!-- <el-select v-model="roleBitsArr" multiple  placeholder="选择权限" @change="roleBitsChange">
              <el-option v-for="item in roleList" :label="item.roleName" value="" :key="item.roleId" ></el-option>
            </el-select> -->
        <!-- <el-checkbox-group v-model="checkedCities1" placeholder="选择权限">
          <el-checkbox v-for="item in roleList" :label="item.roleName" :key="item.roleId" >{{item.roleName}}</el-checkbox>
        </el-checkbox-group> -->

         <!-- <el-checkbox-group  v-model="checkedCities1">
    <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
  </el-checkbox-group> -->
        <!-- =+++=====++++====+++=== -->
        </el-form-item>
        <el-form-item label="职 务:">
              <el-input v-model="editUserData.title" maxlength=10></el-input>
          </el-form-item>
          <el-form-item label="所属部门:">
            <el-input v-model="departmentMsg" disabled></el-input>     
          </el-form-item>
          <el-form-item label="管辖部门:" v-show="isEditUserAdmin">
              <el-select v-model="adminIptValue" placeholder="请选择">
                <el-option value="">
                    <el-tree :data="adminDeptData" 
                    :props="adminDeptProp"
                    show-checkbox
                    node-key="DepartOnlyCode"
                    :default-checked-keys="defaultEditAdmin"
                    :expand-on-click-node=false
                    @check="handleNodeClick"
                    ></el-tree>
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-checkbox-group v-model="editUserData.isDepMaster">
              <el-checkbox label="主管" name="isDepMaster"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="" v-show="isShowDelBox">
            <el-checkbox-group v-model="editUserData.isDel">
              <el-checkbox label="是否删除" name="isDel"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
       </div>
       <div v-show="isShowNext" class="addUserPhone">
        <el-form-item label="手 机 号:" class="mobileInputBox">
            <el-input v-model="editUserData.mobile" @keyup.native="userPhoneChange" maxlength=11></el-input>
        </el-form-item>
        <el-form-item prop="captcha" label="短信验证码:" v-show="isShowCodeIpt">
          <el-input v-model="editUserData.captcha" placeholder="请输入短信验证码" class="codeIpt"></el-input>
          <div class="getPhoneCd" @click="getPhoneCd" v-show="isShowGet">获取手机验证码</div>
          <div class="getPhoneCd againPhoneCd" v-show="isShowAgain">还剩 <span style="color: #FD8F00">{{againTime}}</span> 秒</div>
      </el-form-item>
       </div>
        </el-form>
        <div slot="footer" class="dialog-footer" v-show="isShowEditUser">
           <div v-show="showBeforeBtn">
              <el-button  @click="addBeforeStep" class="sureAdd" v-show="showBeforeBtn">上一步</el-button>
              <el-button  @click="sureEditUser('eidtUserRuleForm')" class="sureAdd" v-show="showBeforeBtn">完成</el-button>
            </div>
            <div v-show="showNextBtn">
              <!-- <el-button @click="editUserBox = false" class="noAdd">取 消</el-button> -->
               <el-button @click="editUserBoxChange" class="noAdd">取 消</el-button>
              <el-button  @click="addNextStep('eidtUserRuleForm')" class="sureAdd" v-show="showNextBtn">下一步</el-button>
            </div>
        </div>
      <div class="leaveOffice">
          <el-dialog
          title='员工离职处理'
          :visible.sync="leaveOfficeBox"
          append-to-body
          class="leaveOffice"
          width=30%
          >
          <p>员工姓名：<span style="color: #333">{{dropCompanyPhone}}</span></p>
          <p style="color: #333">注销帐号后他名下还有<span style="color: #f84949;">{{privateNum}}</span>个私客，将掉入公池</p>
          <p style="color: #f84949;">请确定是否进行注销操作</p>
          <div class="move_footer">
              <el-button  @click="sureEditDeleteUser" class="sureAdd">确 定</el-button>
              <el-button  @click="leaveOfficeBox = false" class="noAdd">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-dialog>
  </div>
  <!-- 新增部门 + 编辑部门-->
  <div class="org_addDepart">
    <el-dialog :title="departTitle" :visible.sync="addDepartBox">
    <el-form :model="editDepartData" :rules="rules" label-width='100px' :inline=true ref="deptRuleForm" class="demo-ruleForm">
    <el-form-item label="部门名称:" prop="name">
      <el-input v-model="editDepartData.name" maxlength="12" placeholder="最大输入12个字"></el-input>
    </el-form-item>
      <el-form-item v-show="isShowCheckBox">
          <el-checkbox label="公司" v-model="editDepartData.isCompany" name="type"></el-checkbox>
      </el-form-item>
       <el-form-item label="省 市:" v-show="isShowCompany" :prop="provinceProp">
        <el-select v-model="editDepartData.province" placeholder="--省--">
          <el-option :label="item.ProvinceName" :value="item.ID" v-for="(item, index) in provinceList" :key="index"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item v-show="isShowCompany">
        <el-select v-model="editDepartData.area" placeholder="--市--">
          <el-option :label="item.CityName" :value="item.CityID" v-for="item in getProvinceName" :key="item.CityName"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="公司属性" v-show="isShowCompany" :prop="companyTypeProp">
        <el-select v-model="editDepartData.type" placeholder="属性">
          <el-option v-for="(item, index) in companyTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="上级部门:">
      <el-input v-model="editDepartData.pname" disabled></el-input>
    </el-form-item>
    <el-form-item label="部门电话:">
      <el-input v-model="editDepartData.mobile" @change="mobileSize"></el-input>
    </el-form-item>
    <el-form-item label="部门地址:">
      <el-input v-model="editDepartData.address" maxlength=50 placeholder="最大输入50个字符"></el-input>
      <div class="departAddressBox"><span>{{departAddress}}</span>/50</div>
    </el-form-item>
    <el-form-item label="团队介绍:">
    <el-input
    type="textarea"
    :autosize="{ minRows: 2, maxRows: 4}"
    placeholder="最大输入200字符"
    maxlength=200
    v-model="editDepartData.description">
    </el-input>
    <div class="departIntroduceBox"><span>{{departIntro}}</span>/200</div>
    </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="sureAddDepartment('deptRuleForm')" class="sureAdd">确 定</el-button>
        <el-button @click="addDepartBox = false" class="noAdd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
  <!-- 删除部门 -->
  <div class="org_deleteDepart">
    <el-dialog
    :title='deleteBoxTitle'
    :visible.sync="deleteDepartBox"
    width="30%"
    >
    <span v-show="employeeNum == 0 ? false : true">该部门还有<span style="color: #f84949">{{employeeNum}}</span>名员工，请先注销所有员工。</span>
    <span v-show="employeeNum == 0 ? true : false">该部门还有<span style="color: #f84949">{{employeeNum}}</span>名员工，您确定删除吗?</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sureClickDeleteDepart">确 定</el-button>
    </span>
    </el-dialog>
  </div>
  <!-- 设置私客掉公的弹框 -->
   <div class="org_empDropTime">
    <el-dialog
    title='公司配置设置'
    :visible.sync="setEmployeeTimeBox"
    width="25%"
    >
    <el-form :model="setCompanyForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic org_empDropTimeCss">
  <el-form-item
    prop="lockTime"
    label="私客掉公时间："
    :rules="[
      { required: true, message: '请输入私客掉公时间', trigger: 'blur' },
    ]"
  >
    <el-input v-model="setCompanyForm.lockTime" placeholder="小时" maxlength=5></el-input>
  </el-form-item>
  <el-form-item
    prop="lockCount"
    label="私客锁定数量："
    :rules="[
      {required: true, message: '请输入私客锁定数量', trigger: 'blur'},
    ]"
  >
    <el-input v-model="setCompanyForm.lockCount" placeholder="数量" maxlength=5></el-input>
  </el-form-item>
  <el-form-item>
  </el-form-item>
</el-form>
    <!-- <div class="empDropTime_content">
       <span>私客掉公时间：</span>
       <el-input type="text" v-model="employeeDropTime" placeholder="小时" style="width: 150px;"></el-input>
    </div>
    <div class="empDropTime_content">
       <span>私客锁定数量：</span>
       <el-input type="text" v-model="employeeDropRerson" placeholder="人" style="width: 150px;"></el-input>
    </div> -->
     <div class="move_footer">
        <el-button  @click="setEmployeeAjax('dynamicValidateForm')" class="sureAdd">确 定</el-button>
        <el-button @click="setEmployeeTimeBox=false" class="noAdd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
  <!-- 上传logo -->
  <div class="org_upload">
      <el-dialog
      title='上传logo'
      :visible.sync="uploadBox"
      width="30%"
      >
      <p>公司名称：<span>{{companyName}}</span></p>
      <p>所属区域：<span>{{companyArea}}</span></p>
      <p>logo图片：</p>
      <div class="uploadLogoBox">
        <div class="message" style="color:　#fa5151;">
          <span>说明:</span>
          <p>1. 只能上传一张图片</p>
          <p>2. 尺寸360*90<br/>大小不超过70kb</p>
        </div>
        <el-upload
        action="/img/upload"
        list-type="picture-card"
        :limit=1
        ref="upload"
        :on-success="uploadLogoSuccess"
        :on-preview="handlePictureCardPreview"
        :beforeUpload="beforeLogoUpload"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <!-- <el-upload
        action="http://s224.360fdc.com:8085/img/upload"
        list-type="picture-card"
        :limit=1
        ref="upload"
        :on-success="uploadLogoSuccess"
        :on-preview="handlePictureCardPreview"
        :beforeUpload="beforeLogoUpload"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload> -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
      <div class="move_footer">
        <el-button  @click="sureUploadLogo" class="sureAdd">确 定</el-button>
        <el-button @click="noUploadLogo" class="noAdd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
  <!-- 退出企业 -->
  
  <!-- 权限管理 -->
  <div class="org_permiss">
     <el-dialog
    title='权限管理'
    :visible.sync="permissManageBox"
    width='700px'
    >
    <button type="button" class="addPermiss" @click="addLimit">新增</button>
    <el-table
      :data="manageDataList"
      border
      style="width: 80%">
      <el-table-column
        label="序号"
        width="80"
        type="index">
      </el-table-column>
      <el-table-column
        prop="name"
        label="服务名称"
        width="200">
      </el-table-column>
      <el-table-column
        label="操作"
        >
         <template slot-scope="scope">
          <button type="button" class="editPermiss" @click="editRadioManage(scope)">编辑</button>
          <button type="button" class="editPermiss" @click="setPermissClick(scope)">设置权限</button>
        </template>
      </el-table-column>
    </el-table>
    <div class="move_footer">
        <!-- <el-button  @click="surePermissManage" class="sureAdd">确 定</el-button> -->
        <!-- 秦星星 begin -->
        <el-button @click="noPermissManage" class="noAddClose">关 闭</el-button>
        <!-- end -->
    </div>
    <div >
      <!-- 编辑权限弹框 -->
      <el-dialog
      class="addNewPermiss"
      title='新增权限'
      :visible.sync="editPermissBox"
      width="30%"
      append-to-body
      >
        <div class="permissIpt">权限名称:<el-input v-model="editLimitIpt.name" maxlength=10></el-input></div>
      <div class="move_footer">
        <el-button  @click="sureEditPermise" class="sureAdd">确 定</el-button>
        <el-button  @click="editPermissBox = false" class="noAdd">取 消</el-button>
      </div>
      </el-dialog>
      <!-- 新增权限弹框 -->
       <el-dialog
      class="addNewPermiss"
      title='新增权限'
      :visible.sync="addPermissBox"
      width="30%"
      append-to-body
      >
        <div class="permissIpt">权限名称:<el-input v-model="addLimitIpt" maxlength=10></el-input></div>
      <div class="move_footer">
        <el-button  @click="sureAddPermise" class="sureAdd">确 定</el-button>
        <el-button  @click="addPermissBox = false" class="noAdd">取 消</el-button>
      </div>
      </el-dialog>
    </div>
    </el-dialog>
  </div>
  <!-- 新增banner弹框 -->
  <div class="org_addBanner">
    <el-dialog title="新增" :visible.sync="addBannerBox" class="addBanner">
      <el-form :model="addBannerForm" :rules="bannerRules" ref="ruleForm">
        <el-form-item label="公 司 名 称：">
          <el-input v-model="addBannerForm.companyName" auto-complete="off" disabled></el-input>
        </el-form-item>
      <el-form-item label="所 属 区 域：">
        <span>{{companyAddress}}</span>
        </el-form-item>
        <el-form-item label="banner类型：" prop="type">
          <el-radio-group v-model="addBannerForm.type"  @change='houseTypeChange'>
            <el-radio  label="0">推荐房源</el-radio>
            <el-radio  label="1">H5广告</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 秦星星加 -->
        <el-form-item label="url链接："  v-show="!projectNameIpt">
          <el-input v-model="addBannerForm.links" auto-complete="off"></el-input>
        </el-form-item>
        <!-- ==== -->
        <el-form-item label="banner名称：" prop="name">
          <el-input v-model="addBannerForm.name" auto-complete="off" maxlength=100 placeholder="最大输入100个字"></el-input>
        </el-form-item>
        <el-form-item label="项 目 名 称："  v-show="projectNameIpt">
          <el-autocomplete
            class="inline-input"
            v-model="addBannerForm.buildName"
            :fetch-suggestions="querySearch"
            placeholder="输入楼盘名称，点击选择"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="banner图片：" class="bannerPhotoBox">
            <!-- <el-upload
              action="http://s224.360fdc.com:8085/img/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-success="uploadLogoSuccess"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload> -->
              <el-upload
              action="/img/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-success="uploadLogoSuccess"
              :beforeUpload="bannerBeforeUp"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <div class="message">
            <span>1.只能上传一张图片</span>
            <span>2.尺寸:750px*350px</span>
            <span>大小：不超过70KB</span>
          </div>
        </el-form-item>
      </el-form>
      <div class="move_footer">
        <el-button  @click="sureAddBanner('ruleForm')" class="sureAdd">确 定</el-button>
        <el-button @click="addBannerBox=false" class="noAdd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
var qinxingxing = 1;
import {
  getDepartList,
  editDepartment,
  getAllProvince,
  deleteDepartment,
  getDeleteDepartNum,
  editUser,
  getEmployeeList,
  editUserPut,
  editDepartmentPut,
  addDepartment,
  getManageInfo,
  editPermisePut,
  addPermise,
  addUser,
  getAdminDept,
  getPersonEmployee,
  moveEmployeePut,
  uploadLogoPut,
  getProjectListInfo,
  addBannerPut,
  getPhoneCode,
  employeeDrop
} from "@/api/index";
import Vue from "vue";
import axios from 'axios'
import { isvalidCard, isMobileSize,isvalidLoginPhone} from "@/views/login/validate.js";
import {RULE} from '@/api/rules'
let validCard = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入身份证号"));
  } else if (!isvalidCard(value)) {
    callback(new Error("身份证号格式不正确"));
  } else {
    callback();
  }
};
// 消息弹框的封装
function alertMessage(type, msg) {
  Vue.prototype.$message({
    type: type,
    message: msg,
    duration: 1000
  });
}
export default {
  mixins: [RULE],
  data() {
    return {
      isUploadLogo: false,
      isAddBanner: false,
      dialogImageUrl: "",
      dialogVisible: false,
      isShowCheckBox: false,
      departTitle: "新增部门",
      editUserTitle: "",
      editDepartData: {},
      // 分页器中的数据
      pageNum: 1,
      pageSize: 5,
      departmentMsg: "",
      companyType: "",
      // 表单中的数据
      formInline: {status:"", keyword:""},
      ruleForm: {},
      companyName: "武汉吉家中房直销",
      companyArea: "华中-湖北-武汉",
      permissManageBox: false, // 权限管理弹框显示
      editPermissBox: false, // 编辑权限弹框的显示
      addPermissBox: false, // 新增权限弹框的显示
      setEmployeeTimeBox:false,  // 设置私客掉公的弹框显示
      employeeDropTime:"",  // 私客掉公的时间
      employeeDropRerson:"",// 私客掉公的数量
      employeeId:"",//私客掉公的id
      leaveOfficeBox: false, //  离职弹框显示
      dropCompanyPhone: "123456789", // 退出企业的当前用户手机
      dropCompanyCode: "", // 退出企业的短信验证码
      privateNum: 2, // 退出企业的私客数量
      showLogoImg: "", // 图片上传成功之后的logo显示
      uploadBox: false, // 上传logo弹框
      isShowEditUser: false, // 编辑用户的弹框显示
      deleteBoxTitle: "", // 删除部门和添加权限的title
      isShowEmployee: false, // 删除部门的span显示
      isShowLimitIpt: false, // 添加权限的input显示
      editLimitIpt: {}, // 编辑权限数据
      addLimitIpt: "", // 新增权限数据
      employeeNum: 20, // 删除部门的员工数量
      deleteDepartBox: false, // 删除部门的弹框
      addDepartBox: false, // 添加部门的弹框
      editUserBox: false, // 编辑用户的弹框
      addUserBox: false, //  添加用户的弹框
      addBannerBox: false, // 新增banner弹框显示
      projectNameIpt: true,
      defaultEditUser:[],  // 编辑用户时的默认的权限id
      companyAddress: "",
      addBannerForm: {},
      getUserInfoParams:{}, // 获取员工信息列表请求参数
      restaurants: [
        { value: "三全鲜食（北新泾店）", address: "长宁区新渔路144号" },
        {
          value: "Hot honey 首尔炸鸡（仙霞路）",
          address: "上海市长宁区淞虹路661号"
        }
      ],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogFormVisible: false,
      isShowMove: false,
      moveEmployee: "刘德华",
      moveEmployeeNum: 1,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      defaultProps: {
        // 左边树形数据的数据规则
        children: "child",
        label: "name"
      },
      isClickSearch: false,
      roleBits:"",   // 新增用户时的权限展示
      editUserRolesShow: "", // 编辑用户时的权限展示
      multipleSelection: [],
      departDataList: [{ name: "" }], // 左边级联部门列表信息展示
      provinceList: [], // 所有省份列表
      cityList: [{ CityName: "请选择省份", CityID: "" }], //   省份对应的市
      userDataList: [], // 员工信息列表数据
      userListTotal: 0, // 分页器的数据总条数的显示
      leftClickContentId: this.$store.state.person.depId, // 点击左边树状时对应的id存储
      editUserData: {}, // 编辑用户信息列表
      companyTypeList: [
        { value: 1, label: "直销" },
        { value: 2, label: "分销" },
        { value: 3, label: "联动" }
      ], // 公司属性下拉选数据
      manageDataList: [], // 权限设置的权限列表数据
      roleList: this.$store.state.person.roleList || [], // 权限列表信息
      addUserForm: { isDepMaster: false,majorArea:"" }, // 添加用户时的数据
      isShowAdminIpt: true, // 管辖部门的input框的显示隐藏
      areaId: 0, // 城市id
      adminDeptData: [], // 管辖部门的数据列表
      adminDeptProp: {
        // 管辖部门树状图的配置项
        label: "DeptName",
        value: "DepartOnlyCode",
        children: "SubDepart"
      },
      employeeProps:{
        label: "roleName",
        value:"roleId"
      },
      adminIptValue: "", // 管辖部门表单的数据
      personId: 0, // 当前用户id
      moveEmpForm: {}, // 批量转移员工的数据
      moveEmpData: [],
      moveEmpProp: {
        value: "id",
        label: "name",
        children: "child"
      },
      departName: "",
      moveEmpList: [], // 批量操作的表格数据
      moveEmpId: [], //批量转移员工的id
      projectListData: [], // 所有项目列表数据
      bannerProject: "", //
      againTime: 60, // 短信验证码倒计时
      isShowGet: true, // 显示获取短信验证码
      isShowAgain: false, // 重新获取验证码显示
      isShowNext: false, // 新增编辑用户下一步的表单显示
      isShowBefore: true, // 新增用户时上一步表单的显示
      showNextBtn: true, //  是否显示下一步按钮
      showBeforeBtn: false, // 是否显示上一步按钮
      showEditUserBefore: true, // 编辑用户时上一步表单的显示
      isShowCodeIpt: false, //是否显得手机短信验证输入框
      userPhone: "", // 每次点击编辑用户的时候的手机号的存储
      isEditUserAdmin: false, // 编辑用户时是否显示管辖部门框
      defaultEditAdmin: [], //  编辑用户时的默认勾选的管辖部门
      roleBitsArr: [], // 权限设置的数组存储id
      needDeleteDepId:"",  // 删除部门时的部门id
      provinceProp:"",  // 省份的必填
      companyTypeProp:"",  // 公司属性的必填
      adminDeptId:"",   //  获取联动公司管辖部门的城市id
      addUserRoleShow:"",
      bannerRules:{
        type:[{ required: true, message:"请输入banner类型", trigger: "change"}],
        name:[{ required: true, message:"请输入banner名称", trigger: "blur"}],
      },
      isShowDelBox:false,
      isSureDepClick: true,
      isSureUserClick:false,
      setCompanyForm: {}
    };
  },
  created() {
    // console.log("规划采购商");
    // console.log(this.$store.state.person.roleList);
    axios.get("/api/department/list/can").then(res => {
      if(res.status === 200 ){
        // 调用获取左边组织架构列表的方法
        this.getLeftDepartList();
        const id = this.$store.state.person.depId;
        editDepartment({ params: { id: id } }).then(res => {
          if(res.status === 200){
            console.log(res);
            this.adminDeptId = res.data.area;
            if(res.data.type == 0){
              this.companyType = "非公司"
            }else{
              this.companyTypeList.forEach(value => {
                // debugger
                if (value.value == res.data.type) {
                  this.companyType = value.label;
                  return;
                }
              });
            }
            this.departmentMsg = res.data.name;
            this.getUserInfo();
          }
        });
      }
    }).catch(err => {
        if(err.response.status === 403){
        this.$router.push({name: "403errorPage"})
        return
        }
    })
  },
  methods: {
    // 获取左边组织架构列表的请求
    getLeftDepartList() {
      // debugger
      getDepartList().then(res => {
        console.log(res);
        if(res.status === 200){
          this.departDataList = JSON.parse("[" + JSON.stringify(res.data) + "]");
        }
      });
    },
    // 获取右边列表信息的方法定义
    // 分页器的每个页面显示的数据量发生改变时
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserInfo();
    },
    // 分页器当前页码发生改变时
    handleCurrentChange(val) {
      // this.isClickSearch ? this.leftClickContentId = "" : ""
      if(this.isClickSearch){
        this.formInline.status ? this. getUserInfoParams.status = this.formInline.status : ""
        this.formInline.keyword ? this. getUserInfoParams.keyword = this.formInline.keyword : ""
         this.leftClickContentId = ""
      }
      this.pageNum = val;
      console.log(this.formInline);
      // (this.formInline.status && this.formInline.keyword) ? this.leftClickContentId = "" : ""
      // (this.formInline.status !== 1 && this.formInline.status !== 2) || this.formInline.keyword ? this.leftClickContentId = "" : ""
      this.getUserInfo();
    },
    // 获取用户信息
    getUserInfo() {
      console.log(this.formInline);
      this.getUserInfoParams.depId = this.leftClickContentId
      this.getUserInfoParams.pageNum = this.pageNum
      this.getUserInfoParams.pageSize = this.pageSize
      getEmployeeList({ params: this.getUserInfoParams }).then(res => {
        res.data.list.forEach(value => {
          value.sex = (value.sex == 1 ? "男" : (value.sex == 2 ? "女" : ""))
          value.status = value.status == 1 ? "在职" : "离职"
          value.joinTime = value.joinTime ? value.joinTime.split(" ")[0] : ""
          // return
          //   (
          //   (value.sex = value.sex == 1 ? "男" : (value.sex == 2 ? "女" : "")) &&
          //   (value.status = value.status == 1 ? "在职" : "离职") && 
          //   (value.joinTime = value.joinTime ? value.joinTime.split(" ")[0] : "")
          //   )
        });
        // console.log(arr);
        console.log(res.data.list);
        this.userDataList = res.data.list;
        this.userListTotal = res.data.total;
        console.log(res);
      });
    },
    // 点击左边组织架构文字时
    getEmployeeInfo(scope) {
      this.isClickSearch = false
      this.pageNum = 1
      this.adminDeptId = scope.area
      console.log(scope);
      this.formInline = {};
      this.leftClickContentId = scope.id;
      this.departmentMsg = scope.name;
       if(scope.type == 0){
        this.companyType = "非公司"
      }else{
        this.companyTypeList.forEach(value => {
          // debugger
          if (value.value == scope.type) {
            this.companyType = value.label;
            return;
          }
        });
      }
      this.getUserInfo();
    },
    handleSelectionChange(select) {
      console.log(select);
      this.moveEmpList = select;
    },
    statusChange(val){
      if(val === 1){
        this.editUserData.leaveTime = ""
        this.isShowDelBox = false
      }else{
        this.isShowDelBox = true
      }
    //  (val == 1)? this.editUserData.leaveTime = "" : ""
    },
    // 点击搜索
    onSearch() {
      this.isClickSearch = true
      // this.formInline.depId = (this.formInline.status !== 1 && this.formInline.status !== 2) || this.formInline.keyword ? "" : this.leftClickContentId
      // this.formInline.depId = this.leftClickContentId;
      this.formInline.pageSize = this.pageSize;
      this.formInline.pageNum = 1;
      getEmployeeList({ params: this.formInline }).then(res => {
        console.log(res);
        this.pageNum = 1
        res.data.list.filter(val => {
          return (
            (val.sex = val.sex == 1 ? "男" : "女") &&
            (val.status = val.status == 1 ? "在职" : "离职") &&
            (val.joinTime = val.joinTime ? val.joinTime.split(" ")[0] : "")
          );
        });
         this.userDataList = res.data.list;
        console.log(this.userDataList);
        this.userListTotal = res.data.total;
      });
    },
    onReset() {
      this.formInline = {};
      this.leftClickContentId = ""
      this.getUserInfo()
    },
    // 点击左边tree设置按钮
    editIcon(data) {
      data.isCompany ? (this.isUploadLogo = true) : (this.isUploadLogo = false);
      data.id === 1 ? (this.isUploadLogo = true) : "";
      data.isCompany ? (this.isAddBanner = true) : (this.isAddBanner = false);
    },
    idCardChange(){
      this.checkIdCard()
    },
    // 点击编辑用户
    editUserBtn(scope) {
      axios.put("/api/employee/can").then(res => {
        if(res.status === 200){
          this.isShowDelBox = false
          this.adminIptValue=""
      editUser({ params: { id: scope.row.id } }).then(res => {
        if(res.status === 200){
        this.editUserData = res.data;
        this.departmentMsg = res.data.depName
        // adminIptValue
        this.defaultEditAdmin = res.data.majorArea ? res.data.majorArea.split(",") : ""
        this.editUserRolesShow = res.data.roleStr
        this.defaultEditUser = res.data.roleIds
        console.log(this.defaultEditUser);
        // console.log(this.defaultEditAdmin);
        console.log(res);
        }else if(res.status === 403){
          this.alertMessage("warning", res.message)
          return
        }
      });
      console.log(scope);
      this.dropCompanyPhone = scope.row.name;
      if (this.companyType == "联动") {
        this.isEditUserAdmin = true;
        // 请求管辖部门接口 this.areaId
        getAdminDept({ params: { cityID: this.adminDeptId } }).then(res => {
          console.log("点击编辑用户");
          let majorArr = []
          let mainArr = []
          let str = ""
          console.log(JSON.parse(res.data));;
          this.adminDeptData = JSON.parse(res.data);
          this.editUserData.majorArea ? majorArr = this.editUserData.majorArea.split(",") : ""
          if(majorArr.length !== 0){
                // str += getAdminName(this.adminDeptData, majorArr) + ","
           
          }
          console.log(str);
        });
      } else {
        this.isEditUserAdmin = false;
      }
        this.isShowCodeIpt = false;
        this.isEditUserAdmin = this.companyType == "联动" ? true : false;
        this.userPhone = scope.row.mobile;
        this.showEditUserBefore = true;
        this.showNextBtn = true;
        this.showBeforeBtn = false;
        this.isShowNext = false;
        this.personId = scope.row.id;
        this.editUserBox = true;
        this.editUserTitle = "编辑用户";
        this.isShowEditUser = true;
        this.isShowMove = false;
        }else{
          this.alertMessage("warning", "无操作权限")
        }
      }).catch(err => {
        if(err.response.status === 403){
          this.alertMessage("warning", "无编辑用户权限")
          return
        }
      })
      
    },
    userPhoneChange() {
      // debugger
      if((this.editUserData.mobile != this.userPhone)){
        this.isShowCodeIpt = true
      }else{
        this.isShowCodeIpt = false
      }
    },
    // 点击确认编辑/新增部门按钮
    sureAddDepartment(deptRuleForm) {
          if(!this.isSureDepClick){return}
          if(this.editDepartData.mobile && !isMobileSize(this.editDepartData.mobile)){return}
      // 拼接好省和市
      let areaName = "";
      this.provinceList.forEach(value => {
        if (this.editDepartData.province == value.ID) {
          areaName += value.ProvinceName + ",";
        }
      });
      this.cityList.forEach(value => {
        if (this.editDepartData.area == value.CityID) {
          areaName += value.CityName;
        }
      });
      this.editDepartData.areaName = areaName;
      this.editDepartData.pId = this.editDepartData.pId;
      console.log(this.editDepartData);
      this.$refs[deptRuleForm].validate(valid => {
        if (valid) {
            if (this.editDepartData.isCompany) {
            if (
              !this.editDepartData.province ||
              !this.editDepartData.area ||
              !this.editDepartData.type
            ) {
              this.alertMessage("warning", "省市或公司属性不为空");
              return false;
            }
          }
          
            if (this.isShowCheckBox) {
              // 请求新增部门接口
              console.log("七号电池圣诞红包his的");
              console.log(this.editDepartData);
              addDepartment(this.editDepartData).then(res => {
                if (res.status === 200) {
                  this.alertMessage("success", "新增成功");
                  this.isSureDepClick = false
                  this.addDepartBox = false;
                  this.getLeftDepartList();
                } else {
                  this.alertMessage("warning", res.message);
                }
              });
            } else {
              // 请求编辑新增部门接口
              // 秦星星改===当pid=-1的时候，重新命名为1
              if (this.editDepartData.pid == -1) {
                this.editDepartData.pid = 1;
              }
              console.log("以撒的高速与复古是否有过");
              console.log(this.editDepartData);
              editDepartmentPut(this.editDepartData).then(res => {
                if (res.status === 200) {
                  this.addDepartBox = false;
                  alertMessage("success", "编辑成功");
                  this.isSureDepClick = false
                  this.getLeftDepartList()
                } else {
                  alertMessage("warning", "编辑失败");
                }
              });
            }
          }else {
          this.alertMessage("warning", "请填写完整信息");
          return false;
        }
      });
    },
    // 点击新增部门
    addDepartBtn(data) {
      axios.post("/api/department/can").then(res => {
        if(res.status === 200){
          this.isSureDepClick = true
             // 发送获取所有省份请求
        getAllProvince().then(res => {
          console.log(res);
          this.provinceList = res.data;
        });
          console.log(data);
          this.editDepartData = {
            isCompany: false
          };
          this.editDepartData.isCompany = false;
          // 请求获取部门信息接口
          editDepartment({ params: { id: data.id } }).then(res => {
            if(res.status === 200){
              this.editDepartData.pname = res.data.name;
              this.addDepartBox = true;
              this.departTitle = "新增部门";
              this.isShowCheckBox = true;
              console.log(res);
              if (res.data.pid == -1) {
                //当pid=-1的时候就重新赋值为1
                this.editDepartData.pid = 1;
              } else {
                this.editDepartData.pid = res.data.pid;
              }
              console.log("我是新增部门胜多负少");
              console.log(data.id);
              this.editDepartData.pid = data.id;
            }else if(res.status === 403){
              this.alertMessage("warning", res.message)
              return
            }
          });
        }else{
          this.alertMessage("warning", "无操作权限")}
      }).catch(err => {
          // debugger
        console.log(err.response);
        if(err.response.status === 403){
          this.alertMessage("warning", "无新增部门权限")
          return
        }
      })
    },
    // 点击编辑部门
    editDepartBtn(data) {
      axios.put("/api/department/can").then(res => {
        if(res.status === 200) {
          this.isSureDepClick = true
             // 发送获取所有省份请求
            getAllProvince().then(res => {
              console.log(res);
              this.provinceList = res.data;
            });
          editDepartment({ params: { id: data.id } }).then(res => {
            this.addDepartBox = true;
            this.isShowCheckBox = false;
            this.departTitle = "编辑部门(公司)";
            console.log(res);
            this.editDepartData = res.data;
            this.companyTypeData = res.data.type;
          });
        }
      }).catch(err => {
        if(err.response.status === 403){
          this.alertMessage("warning", "无编辑部门权限")
          return
        }
      })
      // 请求获取部门信息接口
    },
    // 选择的权限发生改变时
    roleBitsChange(val) {
      console.log(val);
    },
    // 点击确认编辑用户
    sureEditUser(eidtUserRuleForm) {
        this.submitForm('eidtUserRuleForm').then(res => {
          if(!this.editUserData.captcha && this.isShowCodeIpt){
            this.alertMessage("warning", "请输入新的验证码")
            return
          }
          if (this.editUserData.status == 2) {
            this.leaveOfficeBox = true;
            console.log("华盛顿丰富的VB计划表");
            console.log(this.personId);
            getPersonEmployee({ params: { id: this.personId } }).then(res => {
              if (res.status === 200) {
                this.privateNum = res.data;
              }
              console.log(res);
            });
            // this.editUserBox = false
          } else {
            delete this.editUserData.roleIds;
            delete this.editUserData.roleList;
            this.editUserData.leaveTime
              ? ""
              : delete this.editUserData.leaveTime;
            this.editUserData.joinTime ? "" : delete this.editUserData.joinTime;
            this.editUserData.birthday ? "" : delete this.editUserData.birthday;

            // this.editUserData.roleStr = this.editUserData.roleBits
            console.log("秦修改");
            console.log(this.editUserData.roleBits);
            console.log(1 << (this.editUserData.roleBits - 1));
            console.log();
            // this.editUserData.roleBits = 1 << (this.editUserData.roleBits - 1);
            editUserPut(this.editUserData).then(res => {
              console.log(res);
              if (res.status === 200) {
                this.alertMessage("success", "用户修改成功");
                this.editUserBox = false;
                this.getUserInfo();
              } else {
                this.alertMessage("warning", res.message);
              }
            });
          }
        }).catch(err => {
          this.alertMessage("warning","请完善表单")
        })
      console.log(this.editUserData.status);
    },
    // 点击新增用户时的权限时
    handleNodeClickRole(data, value){
      console.log(data);
      console.log(value);
      let str = ""
      let roleId = 0
      value.checkedNodes.forEach(val => {
        str += val.roleName + ","
        roleId += 1 << (val.roleId - 1)
      })
      this.addUserRoleShow = str
      this.addUserForm.roleBits = roleId
    },
    // 身份证号码验证
    checkIdCard(){
      if(this.addUserBox){
        if(!isvalidCard(this.addUserForm.idcard)){
          this.alertMessage("warning", "身份证号格式不正确")
          return 1 
      }else{
        return 0
        }
      }
       if(this.editUserBox){
        if(!isvalidCard(this.editUserData.idcard)){
          this.alertMessage("warning", "身份证号格式不正确")
          return 1
        }else{
          return 0
        }
      }
    },
    // 点击编辑用户权限时
    handleNodeClickEditRole(data, value){
      // debugger
      let str = ""
      let roleId = 0
      value.checkedNodes.forEach(val => {
        str += val.roleName + ","
        roleId += 1 << (val.roleId - 1)
      })
      // this.EditUserRolesShow = str.substr(0, str.length)
      this.editUserRolesShow = str
      this.editUserData.roleBits = roleId
    },
    // 用户状态是离职时的确定编辑
    sureEditDeleteUser(){
        delete this.editUserData.roleIds;
        delete this.editUserData.roleList;
        this.editUserData.leaveTime
          ? ""
          : delete this.editUserData.leaveTime;
        this.editUserData.joinTime ? "" : delete this.editUserData.joinTime;
        this.editUserData.birthday ? "" : delete this.editUserData.birthday;
        // this.editUserData.roleStr = this.editUserData.roleBits
        // console.log("秦修改");
        console.log(this.editUserData.roleBits);
        // console.log(1 << (this.editUserData.roleBits - 1));
        // this.editUserData.roleBits = 1 << (this.editUserData.roleBits - 1);
        editUserPut(this.editUserData).then(res => {
          console.log(res);
          if (res.status === 200) {
            this.alertMessage("success", "用户修改成功");
            this.leaveOfficeBox = false
            this.editUserBox = false;
            this.getUserInfo()
          } else {
            this.alertMessage("warning", res.message);
          }
        });
    },
    // 点击添加用户按钮
    addUserBtn(scope) {
      this.isSureUserClick = true
      this.roleList = []
      this.roleList = JSON.parse(localStorage.getItem("myInfo")).roleList
      // debugger
      this.addUserRoleShow = ""
      axios.post("/api/employee/can").then(res => {
        if(res.status == 200){
          this.roleBits=""
          console.log(scope);
          scope.id ? this.leftClickContentId = scope.id : ""
          scope.area ? this.adminDeptId = scope.area : ""
          this.addUserForm = { isDepMaster: false,majorArea:""};
          this.adminIptValue = "";
          this.isShowBefore = true;
          this.showNextBtn = true;
          this.showBeforeBtn = false;
          this.isShowNext = false;
          this.addUserBox = true;
          this.addUserForm.depName = scope.name ? scope.name : this.departmentMsg;
          if (this.companyType == "联动" || scope.type === 3) {
            this.isShowAdminIpt = true;
            // 请求管辖部门接口 this.areaId
            getAdminDept({ params: { cityID: this.adminDeptId } }).then(res => { 
              console.log(res);
              this.adminDeptData = JSON.parse(res.data);
            });
          } else {
            this.isShowAdminIpt = false;
          }
          console.log(this.companyType);
          // // 秦星星修改
          // this.adminIptValue = scope.name;
          // // this.adminIptValue = "北京"
          // console.log(this.adminIptValue);
          // // 秦星星
          this.addUserForm.depId = this.leftClickContentId;
          console.log(this.addUserForm);
          }else{
          this.alertMessage("warning", "无操作权限")
        }
        }).catch(error => {
           if(err.response.status === 403){
          this.alertMessage("warning", "无添加用户权限")
          return
        }
        }
      )
    },
    // 点击管辖部门节点时
    handleNodeClick(data, value) {
      console.log("秦星星修改1");
      console.log(data);
      console.log(value);
      let str = "";
      value.checkedNodes.forEach(value => {
        str += value.DeptName + ",";
      });
      this.adminIptValue = str;

      this.addUserForm.majorArea = value.checkedKeys.join(",");
      this.editUserData.majorArea = value.checkedKeys.join(",");
    },
    addUserPhoneChange(){
      if(!isvalidLoginPhone(this.addUserForm.mobile)){
        this.alertMessage("info", "请输入正确的手机号")
      }
    },
    // 点击确认添加用户按钮
    sureAddUser(addUserRuleForm) {
      console.log(this.addUserForm);
      if(this.addUserForm.mobile && !isvalidLoginPhone(this.addUserForm.mobile)){
        this.alertMessage("info", "请输入正确的手机号")
        return
      }
        if(!this.isSureUserClick){return}
      this.submitForm('addUserRuleForm').then(res => {
         if (!this.addUserForm.title) {
            this.addUserForm.title = "";
          }
          // console.log("哈哈哈秦星星");
          console.log(this.addUserForm);
          addUser(this.addUserForm).then(res => {
            if (res.status === 200) {
              this.alertMessage("success", "添加成功");
              this.isSureUserClick = false
              this.isShowNext = false;
              this.isShowBefore = true;
              (this.showNextBtn = true), (this.showBeforeBtn = false);
              this.addUserBox = false;
              this.getUserInfo();
            } else {
              this.alertMessage("warning", res.message);
            }
            console.log(res);
      }).catch(error=>{
          this.alertMessage("info", "请输入手机号")
          })
      // this.$refs[addUserRuleForm].validate(valid => {
      //   if (valid) {
      //     //  this.addUserForm.birthday = this.timeFormat(this.addUserForm.birthday)
      //     // this.addUserForm.joinTime = this.timeFormat(this.addUserForm.joinTime)
      //     if (!this.addUserForm.title) {
      //       this.addUserForm.title = "";
      //     }
      //     // console.log("哈哈哈秦星星");
      //     console.log(this.addUserForm);
      //     addUser(this.addUserForm).then(res => {
      //       if (res.status === 200) {
      //         this.alertMessage("success", "添加成功");
      //         this.isShowNext = false;
      //         this.isShowBefore = true;
      //         (this.showNextBtn = true), (this.showBeforeBtn = false);
      //         this.addUserBox = false;
      //         this.getUserInfo();
      //       } else {
      //         this.alertMessage("warning", res.message);
      //       }
      //       console.log(res);
      //     });
      //   } else {
      //     this.alertMessage("warning", "请填写完整表单");
      //     return false;
      //   }
      });
    },
    // 点击树状结构的删除部门
    deleteDepartBtn(data) {
      axios.delete("/api/department/can").then(res => {
        if(res.status === 200){
          this.needDeleteDepId = data.id
          getDeleteDepartNum({ params: { id: data.id } }).then(res => {
            console.log(res);
            this.deleteDepartBox = true;
            this.isShowEmployee = true;
            this.isShowLimitIpt = false;
            this.deleteBoxTitle = "删除部门";
            this.employeeNum = res.data[0].count
          })
        }else{this.alertMessage("warning", "无操作权限")}
      }).catch(err => {
         if(err.response.status === 403){
          this.alertMessage("warning", "无删除部门权限")
          return
        }
      })
      // deleteDepartment({ params: { id: data.id } }).then(res => {
      //   console.log(res);
      //   if (res.status === 500) {
      //     const result = res.message;
      //     this.employeeNum = result.substring(
      //       result.indexOf("有") + 1,
      //       result.indexOf("名")
      //     );
      //   } else {
      //     this.employeeNum = 0;
      //   }
      // });
    },
    // 离职日期改变时
    dropCompanyTimeMethod(){
      let joinTime = 0
      let leaveTime = 0
      this.editUserData.leaveTime ? leaveTime = +new Date(this.editUserData.leaveTime) : ""
      this.editUserData.joinTime ? joinTime = +new Date(this.editUserData.joinTime) : ""
      if(this.editUserData.leaveTime && joinTime > leaveTime){
        this.alertMessage("warning", "离职日期不能小于入职日期")
        return false
      }else{
        return true
      }
    },
     dropCompanyTime(){
       this. dropCompanyTimeMethod()
     },
    // 点击确定删除部门
    sureClickDeleteDepart() {
      if (this.employeeNum === 0) {
        deleteDepartment({params: { id:  this.needDeleteDepId}}).then(res => {
          if(res.status === 200){
            this.alertMessage("success", "删除成功");
            this.getLeftDepartList();
          }else{
            this.alertMessage("success", res.message);
          }
          this.deleteDepartBox = false;
        })
      }else{
        this.deleteDepartBox = false;
      }
    },
    // 点击新增权限
    addLimit() {
      this.addPermissBox = true
      this.addLimitIpt = ""
    },
    // 确认批量转移员工
    sureMoveClick(moveForm) {
      this.$refs[moveForm].validate(valid => {
        if (valid) {
          this.moveEmpForm.eids = this.moveEmpId;
          this.editUserBox = false;
          moveEmployeePut(this.moveEmpForm).then(res => {
            if (res.status === 200) {
              this.alertMessage("success", "转移成功");
              this.editUserBox = false;
              this.getUserInfo()
            } else {
              this.alertMessage("warning", res.message);
            }
          });
        } else {
          this.alertMessage("warning", "请填写完整信息");
          return false;
        }
      });
    },
    // 取消批量转移员工
    noMoveClick(moveForm) {
      this.editUserBox = false;
    },
    // 点击设置私客掉公
    setEmpDropTime(data){
      this.setCompanyForm = {}
     console.log(data);
      axios.put("/api/department/can").then(res => {
        if(res.status === 200){
          if(data.config){
            this.setCompanyForm.lockTime = JSON.parse(data.config).lockTime
            this.setCompanyForm.lockCount = JSON.parse(data.config).lockCount
          }else{
            this.setCompanyForm.lockTime = 48
            this.setCompanyForm.lockCount = 50
          }
          this.setCompanyForm.id = data.id
          // this.employeeId = data.id
          this.setEmployeeTimeBox = true
        }
      }).catch(err => {
        if(err.response.status === 403){
          this.alertMessage("warning", "无操作权限")
        }
      })
    },
    // 点击私掉公的ajax
    setEmployeeAjax(dynamicValidateForm){
      this.$refs[dynamicValidateForm].validate((valid) => {
        if(valid){
          if(!/^\d+$/.test(this.setCompanyForm.lockCount) || !/^\d+$/.test(this.setCompanyForm.lockTime)){
            this.alertMessage("warning", "时间和数量只能为数字")
            return
          }
          employeeDrop(this.setCompanyForm).then(res => {
            if(res.status === 200){
              this.alertMessage("success", "设置成功")
              this.getLeftDepartList()
            }else{
              this.alertMessage("warning", res.message)
              return
            }
            this.setEmployeeTimeBox = false;
          })
        }else{
          this.alertMessage("warning", "请完善表单!")
          return false
        }
      })
      //  employeeDrop({
      //    id:this.employeeId,
      //    lockCount:this.employeeDropRerson,
      //    lockTime:this.employeeDropTime
      //  }).then(res=>{
      //     console.log(res)
      //     if (res.status==200) {
      //        this.alertMessage("warning", res.message);
      //     }else{
      //        this.alertMessage("warning", res.message);
      //     }
      //     this.setEmployeeTimeBox = false;
      //  })
    },
    // 点击批量转移员工
    onExport() {
      axios.put("/api/employee/transfer/can").then(res => {
        if(res.status === 200){
          this.departName=""
          console.log("更好地规划烦得很");
          console.log(this.moveEmpList.length);
          if (this.moveEmpList.length !== 0) {
            getDepartList({ params: { iRoot: true } }).then(res => {
              if(res.status === 200){
                console.log(res);
                this.moveEmpData = JSON.parse("[" + JSON.stringify(res.data) + "]");
              }
            }).catch(err => {
              if(err.response.status === 403){
              this.alertMessage("warning", "无获取部门权限")
              return
              }
            })
            let name = "";
            let arrId = [];
            this.moveEmpList.forEach(value => {
              name += value.name + "、";
              arrId.push(value.id);
            });
            this.moveEmpId = arrId;
            name = name.substr(0, name.length - 1);
            this.moveEmployee = name;
            this.moveEmployeeNum = arrId.length;
            this.editUserBox = true;
            this.editUserTitle = "批量转移员工";
            this.isShowMove = true;
            this.isShowEditUser = false;
          } else {
            // 秦星星 --- 没有选的时候给一个提醒
            this.alertMessage("warning", "请选择员工");
          }
        }else{
          this.alertMessage("warning", "无操作权限")
        }
      }).catch(err => {
         if(err.response.status === 403){
          this.alertMessage("warning", "无操作权限")
          return
        }
      })
    },
    // 点击转移部门节点时
    clickNode(data, value, ss) {
      console.log(data);
      this.moveEmpForm.desDepId = data.id;
      this.departName = data.name;
    },
    // 请求获取权限列表
    getPermiseInfo() {
      getManageInfo().then(res => {
        console.log(res);
        this.manageDataList = res.data;
      });
      this.permissManageBox = true;
    },
    // 点击权限设置时
    permissManage() {
      axios.get("/api/func/role/can").then(res => {
        if(res.status === 200){
          this.getPermiseInfo();
        }else{this.alertMessage("warning", "无操作权限")}
      }).catch(function(err){
        // debugger
       if(err.response.status === 403){
          this.alertMessage("warning", "无操作权限")
          return
       }
      })
      // 请求获取权限列表
    },
    // 点击编辑权限时
    editRadioManage(scope) {
      this.editPermissBox = true;
      this.editLimitIpt.name = scope.row.name;
      this.editLimitIpt.id = scope.row.id
      console.log(scope);
    },
    // 确认编辑权限
    sureEditPermise() {
      if(!this.editLimitIpt.name){
        this.alertMessage("warning", "权限不能为空")
        return
      }
      editPermisePut(this.editLimitIpt).then(res => {
        if (res.status === 200) {
          alertMessage("success", "编辑成功");
          this.editPermissBox = false;
          this.getPermiseInfo()
        } else {
          alertMessage("warning", "编辑失败");
        }
        console.log(res);
      });
    },
    // 点击确认新增权限时
    sureAddPermise() {
      if(!this.addLimitIpt){
        this.alertMessage("warning", "请输入权限名称")
        return
      }
      addPermise({ name: this.addLimitIpt }).then(res => {
        if (res.status === 200) {
          alertMessage("success", "新增成功");
          this.addPermissBox = false;
          this.getPermiseInfo();
        } else {
          alertMessage("warning", res.message);
        }
      });
    },
    // 点击上传logo
    uploadLogo(data) {
      axios.put("/api/department/logo/can").then(res => {
        if(res.status === 200){
          console.log(data);
          let areaStr = "";
          editDepartment({ params: { id: data.id } }).then(res => {
            areaStr = res.data.areaName.split(",").join("-");
            this.companyArea = areaStr;
          });
          this.companyName = data.name;
          this.uploadBox = true;
          this.leftClickContentId = data.id;
        }else{this.alertMessage("warning", "无操作权限")}
      }).catch(err => {
        if(err.response.status === 403){
          this.alertMessage("warning", "无操作权限")
          return
        }
      })
    },
    // 点击确认上传按钮
    sureUploadLogo() {
      if (!this.dialogImageUrl) {
        this.alertMessage("warning", "图片不能为空");
        return false;
      }
      uploadLogoPut({
        id: this.leftClickContentId,
        logo: this.dialogImageUrl
      }).then(res => {
        if (res.status === 200) {
          // 秦星星增加---公司logo---左上角使用
          if(uploadLogoPut.id === JSON.parse(localStorage.getItem("myInfo")).depId){
            let params = JSON.parse(localStorage.getItem("myInfo"))
            params.companyLogo = this.dialogImageUrl
            this.$store.commit("companyLogo", this.dialogImageUrl);
            localStorage.setItem("myInfo", JSON.stringify(params))
          }
          this.alertMessage("success", "logo上传成功");
          this.uploadBox = false;
          this.$refs.upload.clearFiles();
          this.getLeftDepartList();
        } else {
          this.alertMessage("warning", "图片上传失败");
        }
      });
    },
    beforeLogoUpload(file) {
      if (file.size / 1024 > 70) {
        this.alertMessage("warning", "图片大小不超过70kb");
        return false;
      }
      console.log(file);
    },
    bannerBeforeUp(file){
      if (file.size / 1024 > 70) {
        this.alertMessage("warning", "图片大小不超过70kb");
        return false;
      }
    },
    // 点击取消上传按钮
    noUploadLogo() {
      this.uploadBox = false;
    },
    clickList(row, event, column) {},
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 文件上传成功的钩子
    uploadLogoSuccess(file) {
      console.log(file);
      this.dialogImageUrl = file.images[0].src;
      console.log(this.dialogImageUrl);
    },
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    // 点击确定权限管理的修改
    surePermissManage() {
      this.permissManageBox = false;
    },
    // 点击取消权限管理的修改
    noPermissManage() {
      this.permissManageBox = false;
    },
    // 点击设置权限按钮
    setPermissClick(scope) {
      // 跳转路由
      this.$router.push({
        path: "setPermiss",
        query: { roleId: scope.row.id }
      });
    },
    // 点击新增banner
    addBanner(data) {
      axios.post("/api/banner/can").then(res => {
        if(res.status === 200){
          this.addBannerForm={}
          console.log(data);
          let areaStr = "";
          editDepartment({ params: { id: data.id } }).then(res => {
            areaStr = res.data.areaName.split(",").join("-");
            this.companyAddress = areaStr;
          });
          this.addBannerForm.companyId = data.id;
          this.addBannerForm.companyName = data.name;
          this.addBannerBox = true;
        }else{this.alertMessage("warning", "无操作权限")}
      }).catch(err => {
        if(err.response.status === 403){
          this.alertMessage("warning", "无操作权限")
          return
        }
      })
    },
    // 确定点击新增banner
    sureAddBanner(ruleForm) {
  this.$refs[ruleForm].validate(valid => {
    if (valid) {
      if(!this.dialogImageUrl){
        this.alertMessage("warning", "请选择banner图片")
        return
      }
      this.projectListData.forEach(value => {
        if (value.value === this.addBannerForm.buildName) {
          this.addBannerForm.buildId = value.id;
        }
      });
      this.addBannerForm.url = this.dialogImageUrl;
      // this.addBannerForm.links = ""
      console.log("好地方合适的话");
      console.log(this.addBannerForm);
      addBannerPut(this.addBannerForm).then(res => {
        if (res.status === 200) {
          this.alertMessage("success", "添加成功");
          this.addBannerBox = false;
        }else {
          this.alertMessage("warning", res.message);
        }
      })
    }else{
      this.alertMessage("warning", "请完善表单")
    }
  })
    },
    // 点击table行的时候
    tableRowClick(row, event, column){
      console.log(row);
      console.log(column);
      console.log(event);
    },
    querySearch(queryString, cb) {
      console.log(queryString);
      this.projectListData = [];
      getProjectListInfo({
        params: { keyword: queryString, pageSize: 0, pageNum: 0 }
      }).then(res => {
        console.log(res);
        if (res.status === 200) {
          res.data.list.forEach(value => {
            this.projectListData.push({ value: value.name, id: value.id });
          });
        }
      });
      cb(this.projectListData);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    houseTypeChange() {
      this.addBannerForm.type == "1"
        ? (this.projectNameIpt = false)
        : (this.projectNameIpt = true);
    },
    /* ================ */

    /* =========== */
    // 点击获取验证码
    getPhoneCd() {
      let params = {};
      if (this.addUserBox) {
        params = { mobile: this.addUserForm.mobile, type: 1 };
        if(!isvalidLoginPhone(this.addUserForm.mobile)){
          this.alertMessage("info", "请输入正确的手机号")
        return}
      } else {
        params = { mobile: this.editUserData.mobile, type: 1 };
          if(!isvalidLoginPhone(this.editUserData.mobile)){
            this.alertMessage("info", "请输入正确的手机号")
          return}
      }
      getPhoneCode({ params: params }).then(res => {
        if(res.status === 200){
          this.isShowGet = false;
          this.isShowAgain = true;
          let timerId = setInterval(() => {
            this.againTime--;
            if (this.againTime == 0) {
              clearInterval(timerId);
              this.againTime = 60;
              this.isShowGet = true;
              this.isShowAgain = false;
        }
      }, 1000);
      }else{
        this.alertMessage("warning",res.message)
        return
      }
        console.log(res);
      }).catch(err => {
        console.log(err);
        this.alertMessage("warning",err.message)
      });
    },
    addNextStep(aaa) {
      let refStr = (aaa == "addUserRuleForm") ? "addUserRuleForm" : "eidtUserRuleForm"
      // (refStr == "addUserRuleForm" && this.addUserForm.roleBits) ? this.roleProps = "" : ""
     
        // console.log(this.roleBitsArr);
        this.submitForm(refStr).then(res => {
           if(this.checkIdCard() == 0){
             if(refStr == "addUserRuleForm" && !this.addUserForm.roleBits){
               this.alertMessage("info", "请选择权限")
               return
             } if(refStr == "eidtUserRuleForm" && !this.editUserRolesShow){
               this.alertMessage("info", "请选择权限")
               return
             }
            if(this.editUserData.status == 2 && !this.editUserData.leaveTime){
                this.alertMessage("warning", "请输入离职日期")
                return
              }
              if(!this.dropCompanyTimeMethod()){return}
              // if(this.addUserForm.majorArea && this.addUserForm.majorArea.split(",").length > 200){
              //   this.alertMessage("warning", "管辖部门不能超过200个")
              //   return
              // }
              (!this.isShowDelBox || !this.editUserData.isDel) ? this.editUserData.isDel = false : "" 
              this.showEditUserBefore = false;
              this.isShowNext = true;
              this.isShowBefore = false;
              (this.showNextBtn = false), (this.showBeforeBtn = true);
              console.log(this.editUserData.isDel);
           }
        }).catch(error=>{
            let toastMsg = this.rules[Object.keys(error)[0]][0].message
            this.alertMessage("info", toastMsg)
          })
      //   this.$refs[addUserRuleForm].validate(valid => {
      //     if (valid) {
      //       if(this.editUserData.status == 2 && !this.editUserData.leaveTime){
      //         this.alertMessage("warning", "请输入离职日期")
      //         return
      //       }
      //       this.showEditUserBefore = false;
      //       this.isShowNext = true;
      //       this.isShowBefore = false;
      //       (this.showNextBtn = false), (this.showBeforeBtn = true);
      //     } else {
      //       this.alertMessage("warning", "请填写完整表单");
      //       return false;
      //     }
      //   });
      // }else{
      //   this.alertMessage("warning", "身份证号格式不正确")
      // }
      
    },
    addBeforeStep() {
      this.showEditUserBefore = true;
      this.isShowNext = false;
      this.isShowBefore = true;
      (this.showNextBtn = true), (this.showBeforeBtn = false);
    },
    // 秦星星修改===点击用户编辑===取消按钮，清空管辖部门数据
    editUserBoxChange() {
      // this.adminIptValue = "";
      this.editUserBox = false;
      console.log("驱蚊器无");
    },
    // 新增部门电话号码验证
    mobileSize() {
      isMobileSize(this.editDepartData.mobile);
    },
    checkSelect(selecttion, row){
      console.log(selecttion);
      console.log(row);
    }
  },
  // 添加用户的时候的下一步
  computed: {
    getProvinceName: function() {
      let arr = [];
      this.provinceList.forEach(item => {
        if (item.ID === this.editDepartData.province) {
          this.editDepartData.areaName = item.ProvinceName;
          arr = item.CityList;
          this.cityList = arr;
        }
      });
      return arr;
    },
    departAddress() {
      return this.editDepartData.address
        ? this.editDepartData.address.length
        : 0;
    },
    departIntro(){
       return this.editDepartData.description
        ? this.editDepartData.description.length
        : 0;
    },
    isShowCompany() {
      if(this.editDepartData.isCompany){
        this.provinceProp = "province"
        this.companyTypeProp = "type"
      }else{
        this.provinceProp = ""
        this.companyTypeProp = ""
      }
      return this.editDepartData.isCompany;
    }
  }
};
</script>
<style lang='scss' scoped>
  /deep/.rolePermissItem{
    label::before{
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
      }
  }
   /deep/.mobileInputBox{
    label::before{
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
      }
  }
  /deep/.permissIpt::before{
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
  }
  /deep/.bannerPhotoBox{
    label::before{
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
      }
  }
.orgLeft-setBox {
  position: relative !important;
}
.el-dropdown-menu {
  left: 63px !important;
}
/deep/ .el-tree-node>.el-tree-node__children {
  overflow: inherit;
}
.org_container {
  .org_leftTree{
    height: 610px;
    overflow: scroll;
    // width: 320px;
    background-color: #fff;
  }
  .listContent {
    overflow: scroll;
    width: 320px;
  }
  .departIntroduceBox{
    position: absolute;
    right: 0;
    top: 60px;
    color: #666;
  }
  .org-icon {
    font-size: 15px;
    margin-right: 3px;
    line-height: 5px;
  }
  .orgLeft-icon {
    font-size: 19px;
    color: #333;
    margin-left: 8px;
  }
  display: flex;
  justify-content: space-between;
  .newDepartBox {
    text-align: center;
  }
  .org_addDepart {
    .departName {
      width: 289px;
      height: 30px;
      background-color: #ffffff;
      border-radius: 3px;
      border: solid 1px #dcdfe6;
      margin-right: 136px;
      padding: 0 15px;
      font-size: inherit;
      color: #606266;
      &:focus {
        border-color: #409eff;
      }
    }
    .departAddressBox {
      color: #666;
    }
  }
  // 左边树状样式
  .left_Content {
    width: 20%;
    margin-right: 20px;
  }
  .right_Content {
    overflow: auto;
    .el-form {
      background-color: #d7d7df;
      .searchBtn,
      .resetBtn {
        background-color: #fd8f00;
        border-radius: 3px;
        width: 66px;
        border: none;
        margin-left: 19px;
        height: 30px;
        color: #fff;
        cursor: pointer;
      }
      .addIpt,
      .piliangBtn,
      .adminBtn {
        width: 105px;
        background-color: #72a0d1;
        border-radius: 3px;
        border: none;
        margin-left: 19px;
        height: 30px;
        color: #fff;
        cursor: pointer;
      }
      .resetBtn {
        background-color: #a0a0a0;
      }
    }
    .nowAdress {
      height: 51px;
      background-color: #fdf7e1;
      line-height: 51px;
      padding-left: 20px;
      span {
        font-size: 14px;
        color: #333;
        margin-right: 30px;
      }
    }
    .editData {
      width: 58px;
      height: 26px;
      background-color: #31313c;
      border-radius: 3px;
      border: none;
      outline: none;
      cursor: pointer;
      color: #fefefe;
    }
    .zhuGuan {
      color: #fa7a58;
      margin-left: 5px;
      font-size: 12px;
      border: 1px solid #fa7a58;
      border-radius: 3px;
    }
  }
  /deep/ .org_empDropTimeCss{
     margin-top: 15px;
        .el-form-item__label{
        width: 150px!important;
      }
      .el-input{
        width: auto;
      }
  }
  .org_empDropTime{
    .empDropTime_content{
      text-align: center;
      margin-top: 15px;
    }
    .move_footer{
      margin-top: 40px;
      padding: 20px 0;
    }
  }
  .move_footer {
    margin-top: 130px;
  }
  .sureAdd {
    background: #fd8f00;
  }
  .noAdd {
    background-color: #a0a0a0;
  }
  .getPhoneCd {
    color: #fd8f00;
    cursor: pointer;
    width: 98px;
    font-size: 12px;
    position: absolute;
    left: 197px;
    top: 8px;
    height: 35px;
    line-height: 27px;
    text-align: right;
  }
  .againPhoneCd {
    color: #666;
    font-size: 12px;
    cursor: text;
  }
  .noAdd,
  .sureAdd {
    width: 104px;
    height: 40px;
    border-radius: 5px;
    border: none;
    color: #fff;
  }
  // 秦星星增加
  .noAddClose {
    width: 104px;
    height: 40px;
    border-radius: 5px;
    border: none;
    background-color: #ccc;
    margin-left: -85px;
  }
  .el-button:focus,
  .el-button:hover {
    color: #31313c;
  }
  // 上传logo样式
  .org_upload {
    height: 200px;
    position: relative;
    .uploadLogoBox {
      width: 68px;
      height: 68px;
      position: absolute;
      top: 149px;
      left: 130px;
      background-color: #e6e6e6;
      /deep/ .el-upload.el-upload--picture-card{
        background: none!important;
      }
      .el-icon-plus{
        width: 30px;
        height: 30px;
        border: 1px solid #a1a1a1;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        &::before{
          font-size: 16px;
          position: absolute;
          top: 6px;
          left: 6px;
        }
      }
      .message {
        position: absolute;
        width: 130px;
        height: 12;
        top: 0;
        left: 215px;
        span { color: #333; }
        p {
          margin-bottom: 0;
          color: #ff5151;
        }
      }
    }
    .move_footer {
      text-align: center;
      margin-top: 130px;
    }
    p {
      color: #666;
      margin-bottom: 16px;
      span {
        color: #333;
      }
    }
  }
  
  /deep/ .el-dialog__body {
      .el-checkbox__label,
      .el-form-item__label {
          color: #666;
          font-weight: 400!important;
      }
  }
  // 退出企业样式

  .org_permiss {
    .addPermiss {
      border: none;
      width: 80px;
      height: 34px;
      background-color: #72a0d1;
      border-radius: 3px;
      margin-bottom: 10px;
      color: #fff;
      cursor: pointer;
    }
    .move_footer {
      text-align: center;
      margin-bottom: 50px;
      margin-top: 50px;
    }
    .editPermiss {
      padding: 5px;
      height: 26px;
      background-color: #31313c;
      border-radius: 3px;
      border: none;
      outline: none;
      cursor: pointer;
      color: #fefefe;
    }
  }
}
// 离职样式
.leaveOffice {
  p {
    margin-bottom: 15px;
    width: 100%;
    text-align: center;
    &:nth-of-type(2) {
      margin-top: 40px;
      color: #666;
    }
    &:nth-of-type(3) {
      color: #f84949;
    }
    span {
      color: #666;
    }
  }
}
.addNewPermiss {
  .el-dialog {
    .el-dialog__body {
      margin-top: 20px;
      color: #333;
      letter-spacing: 1px;
      .permissIpt {
        text-align: center;
      }
      .el-input {
        width: 240px;
        height: 30px;
        margin-left: 8px;
      }
    }
  }
}
</style>