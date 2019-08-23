<!-- 项目 -->
<template>
  <div class="container" id="projectList">
    <!-- form表单 -->
    <el-form :inline="true" :model="keyWordForm" class="demo-form-inline w-select" min-width="1398px">
      <el-form-item label="省:">
        <el-select v-model="keyWordForm.provinceId" placeholder="全部" size="mini" :class="selectWeight[0]?'font-weight':''" @change="provinceChange">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(value,key) in allProvinceData" :key="value.provinceId" :label="value.province"
                     :value="value.provinceId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市:">
        <el-select v-model="keyWordForm.cityId" placeholder="全部" size="mini" :class="selectWeight[1]?'font-weight':''" @change="cityChange">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(value,key) in allCityData" :key="value.cityId" :label="value.city"
                     :value="value.cityId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="片区：">
        <el-select v-model="keyWordForm.areaId" placeholder="全部" size="mini" :class="selectWeight[2]?'font-weight':''" @change="areaChange">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(value,key) in allAreaData" :key="value.areaId" :label="value.area"
                     :value="value.areaId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商圈：">
        <el-select v-model="keyWordForm.businessDistrictId" placeholder="全部" size="mini" :class="selectWeight[3]?'font-weight':''" @change="businessDisChange">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(value,key) in allBusinessData" :key="value.businessDistrictId" :label="value.businessDistrict"
                     :value="value.businessDistrictId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司：">
        <el-select v-model="keyWordForm.commercialInfo" placeholder="全部" size="mini" :class="selectWeight[4]?'font-weight':''" @change="companyChange">
          <el-option label="全部" :value=-500></el-option>
          <el-option label="中房科瑞" :value=-1></el-option>
          <el-option v-for="(value,key) in keyWordCompany" :key="value.d_id" :label="value.name"
                     :value="value.d_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目状态：">
        <el-select v-model="keyWordForm.projectState" placeholder="全部" size="mini" v-if="dictionary['117']" :class="selectWeight[5]?'font-weight':''"  @change="projectStateChange">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(value,key) in dictionary['117'].children" :label="value.value" :value="value.key"
                     :key="value.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="项目类型：">
        <el-select v-model="keyWordForm.projectType" placeholder="全部" size="mini" v-if="dictionary['111']" :class="selectWeight[6]?'font-weight':''" @change="projectTypeChange">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(value,key) in dictionary['111'].children" :label="value.value" :value="value.key"
                     :key="value.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="关键词: ">
        <el-input v-model="keyWordForm.keyword" placeholder="请输入楼盘名称" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="onSearch" class="search-but">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="onReset" class="chongzhi-but">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addProjectBtn" background-color="#72A0D1" class="but-lightblue"><span
          class="icon icon-addNew org-icon"></span>新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onExport" class="but-lightblue"><span class="icon icon-daochu org-icon"></span>导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 新增 弹出框 -->
    <el-dialog title="新增项目" :visible.sync="dialogAddFormVisible" :before-close="handleClose" top="40px" class="dialog-info">
      <el-form :model="addForm" :inline="true" :rules="rules" ref="addForm" label-position="left">
        <!-- 供求类型 -->
        <div class="form-row-info">
          <span>供求类型<br><i style="color:red;font-weight:normal">(必填)</i></span>
          <div class="info-content">
            <el-form-item label="项目类型:" prop="projectType">
              <el-radio-group v-model="addForm.projectType" v-if="dictionary['111']">
                <el-radio v-for="(item,key) in dictionary['111'].children" :key="key" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="项目状态:" prop="projectState">
              <el-radio-group v-model="addForm.projectState" v-if="dictionary['117']">
                <el-radio v-for="(item,key) in dictionary['117'].children" :key="key" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="form-row-info">
          <span>基本信息<br><i style="color:red;font-weight:normal">(必填)</i></span>
          <div class="info-content">
            <el-form-item required>
              <el-col :span="11">
                <el-form-item label="项目名称:" prop="name">
                  <el-input v-model="addForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="项目价格:" prop="buildingPrice">
                  <el-input v-model="addForm.buildingPrice" @blur="projectPrice" @keyup.native="getInt('buildingPrice',0)">
                    <template slot="append">元/平方</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item required>
              <el-col :span="11">
                <el-form-item label="所属省份:" prop="provinceId">
                  <el-select v-model="addForm.provinceId" @change="addProvinceChange">
                    <el-option v-for="(value,key) in cityList" :key="value.ID" :label="value.ProvinceName"
                               :value="value.ID"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="所属城市:" prop="cityId">
                  <el-select v-model="addForm.cityId" @change="addCityChange" ref="province">
                    <el-option v-for="(value,key) in allCity" :key="value.CityID" :label="value.CityName"
                               :value="value.CityID"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item required>
              <el-col :span="11">
                <el-form-item label="所属区域:" prop="areaId">
                  <el-select v-model="addForm.areaId" @change="addAreaChange">
                    <el-option v-for="(value,key) in allArea" :key="value.ID" :label="value.AreaName"
                               :value="value.ID"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="所属商圈:" prop="businessDistrictId">
                  <el-select v-model="addForm.businessDistrictId" @change="businessChange">
                    <el-option v-for="(value,key) in allBusiness" :key="value.ShangQuanName" :label="value.ShangQuanName"
                               :value="value.ID"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="项目地址:" prop="address" class="project_address">
              <el-input  v-model="addForm.address"></el-input>
            </el-form-item>
            <el-form-item label="地图坐标:" prop="coordinate" class="map-location">
              <el-input v-model="addForm.coordinate"></el-input>
              <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" class="a-coord">拾取坐标</a>
            </el-form-item>
            <el-form-item label="是否上架:" prop="statusSell">
              <el-radio-group v-model="addForm.statusSell" v-if="dictionary['123']">
                <el-radio v-for="(item,key) in dictionary['123'].children" :key="key" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="楼盘性质:" prop="buildingProperty">
              <el-radio-group v-model="addForm.buildingProperty" v-if="dictionary['208']">
                <el-radio v-for="(item,key) in dictionary['208'].children" :key="key" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="同步系统:" prop="platform">
              <el-checkbox-group v-model="addForm.platform" v-if="dictionary['145']">
                <el-checkbox v-for="item in dictionary['145'].children" :label="item.key" name="type">{{item.value}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item> -->
          </div>
        </div>
        <div class="form-row-info">
          <span>保护期<br><i style="color:red;font-weight:normal">(必填)</i></span>
          <!-- <div class="info-content">
            <el-form-item required>
              <el-col :span="11">
                <el-form-item label="项目有效类型:" prop="customerType">
                  <el-select v-model="addForm.customerType" size="mini" v-if="dictionary['126']">
                    <el-option v-for="item in dictionary['126'].children" :label="item.value" :value="item.key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="佣金:">
                  <el-input v-model="addForm.moneyUnit" type="textarea" maxlength=50></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item required>
              <el-col :span="11">
               <el-form-item label="报备保护期:" prop="proTimeAgentReport">
                  <el-input v-model="addForm.proTimeAgentReport" @keyup.native="getInt('proTimeAgentReport')">
                    <template slot="append">小时</template>
                  </el-input>
                </el-form-item>           
              </el-col>
              <el-col :span="11">
                 <el-form-item label="报 备 规 则:" class="protactInfo">
                  <el-input v-model="addForm.reportRule" type="textarea" maxlength=500></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item required>
              <el-col :span="11">
                 <el-form-item label="带看保护期:" prop="proTimeAgentLook">
                  <el-input v-model="addForm.proTimeAgentLook" @keyup.native="getInt('proTimeAgentLook')">
                    <template slot="append">小时</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                  <el-form-item label="下定保护期:">
                    <el-input v-model="addForm.proTimeDownPayment" @keyup.native="getInt('proTimeDownPayment')">
                      <template slot="append">小时</template>
                    </el-input>
                  </el-form-item>
              </el-col>
            </el-form-item>
          </div> -->
           <div class="info-content">
            <el-form-item required>
              <el-col :span="11">
                <el-form-item label="项目有效类型:" prop="customerType">
                  <el-select v-model="addForm.customerType" size="mini" v-if="dictionary['126']">
                    <el-option v-for="(item,key) in dictionary['126'].children" :key="key" :label="item.value" :value="item.key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="佣金:">
                  <el-input v-model="addForm.moneyUnit" type="textarea" maxlength=50></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item required>
              <el-col :span="11">
                 <el-form-item label="佣金规则:">
                    <el-input v-model="addForm.moneyDes" type="textarea" maxlength=300 >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
               <el-form-item label="报备保护期:" prop="proTimeAgentReport">
                  <el-input v-model="addForm.proTimeAgentReport" @keyup.native="getInt('proTimeAgentReport')">
                    <template slot="append">小时</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item required>
              <el-col :span="11">
                 <el-form-item label="报 备 规 则:" class="protactInfo">
                  <el-input v-model="addForm.reportRule" type="textarea" maxlength=500></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                 <el-form-item label="带看保护期:" prop="proTimeAgentLook">
                  <el-input v-model="addForm.proTimeAgentLook" @keyup.native="getInt('proTimeAgentLook')">
                    <template slot="append">小时</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item required>
                  <el-form-item label="下定保护期:">
                    <el-input v-model="addForm.proTimeDownPayment" @keyup.native="getInt('proTimeDownPayment')">
                      <template slot="append">小时</template>
                    </el-input>
                  </el-form-item>
            </el-form-item>
          </div>
        </div>
        <div class="form-row-info">
          <span>合同信息</span>
          <div class="info-content">
            <el-form-item required>
              <el-col :span="11">
              <el-form-item label="合同截止时间:">
                <el-date-picker
                  v-model="addForm.timeOfEnd"
                  type="date"
                  placeholder="选择日期"
                  format= "yyyy-MM-dd"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              </el-col>
                <el-form-item v-show="addForm.timeOfEnd">
                  <el-checkbox label="合同到期下架" v-model="addForm.lowerFrame"></el-checkbox>
                  <p style="color: red;fontSize: 12px;">合同到期前10天短信通知项目负责人。</p>
                </el-form-item>
            </el-form-item>
          </div>
        </div>
        <div class="form-row-info">
          <span>项目图片</span>
          <div class="info-content upload-info">
            <span class="uploadDefaultText">如果没有上传项目图片，系统会采用默认图片。</span>
            <ul class="upload-image-list">
              <li v-for="item in addForm.projectPictureList" :key="item.imgUrl">
                <img :src="item.imgUrl" alt="">
                <span @click="uploadImageOpera(item,'del')">X</span>
                <span :class="[coverPhoto===item.imgUrl?'cover-photo':'']" @click="uploadImageOpera(item)">设为封面</span>
              </li>
              <li class="upload-box">
                <input type="file" @change="upLoadImage" v-show="false" ref="upload">
              <p class="upload-btn gallery-window-opera" @click="toUpload(1)"><span>+</span></p>
              </li>
            </ul>
            <!-- <div class="upload-box">
              <input type="file" @change="upLoadImage" v-show="false" ref="upload">
              <p class="upload-btn" @click="toUpload(1)"><i class="el-icon-plus" style="fontSize: 36px"></i></p>
            </div> -->
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPro" class="pop-submitbtn">确 定</el-button>
        <el-button type="cancel" @click="dialogAddFormVisible = false" class="pop-cancelbtn">取 消</el-button>
      </div>
    </el-dialog>
    <!-- table表格 -->
    <el-table :data="tableData" style="width: 100%" class="el-table table-list" :row-key="getRowKeys" @row-click="rowClick"
              @expand-change="showDetail" :expand-row-keys="expands">
      <el-table-column type="expand" width="5">
        <template slot-scope="props">
          <ul class="collapse-view" @dblclick="rowDblclick">
            <li>
              <img :src="rowExpand.coverPhoto" alt="">
            </li>
            <li>
              <p>{{ rowExpand.name }}</p>
              <p>{{ rowExpand.area }}-{{ rowExpand.businessDistrict }}</p>
            </li>
            <li class="tip tip-red">
              <p>{{ rowExpand.projectStatusString }}</p>
              <p>{{ rowExpand.statusSellString }}</p>
            </li>
            <li>
              <p>{{ rowExpand.projectTypeString }}</p>
              <p>{{ rowExpand.buildingPrice }}元/平米</p>
            </li>
            <li>
              <p>{{rowExpand.leader}}</p>
              <p>{{rowExpand.leaderMobile}}</p>
            </li>
            <li class="tip tip-green">
              <p>{{ rowExpand.effectiveTypeOfProjectString }}</p>
              <p>{{ rowExpand.buildingPropertyString }}</p>
            </li>
            <li>
              <p>报备保护期: {{rowExpand.proTimeAgentReport}}小时</p>
              <p>带看保护期: {{rowExpand.proTimeAgentLook}}小时</p>
              <p>下定保护期: {{rowExpand.proTimeDownPayment}}小时</p>
            </li>
            <li>
              <p v-html="spotFormatter(rowExpand.platformString)" style="display: flex;flex-direction: column;"></p>
            </li>
            <li class="tip opera">
              <i class="icon icon-bianji" @click="toEdit(rowExpand.name)">编辑</i>
              <i  class="icon icon-shujutongjixinhao" @click="getProjectStatistics('init')">统计</i>
              <!--<input type="button" value="编辑" class="btn-edit" @click="toEdit">
              <input type="button" value="统计" class="btn-stat" @click="getProjectStatistics('init')">-->
            </li>
          </ul>
          <!--<el-row style="min-width: 1398px">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-col :span="5" class="expand-one">
                <div class="ep-oneleft">
                  <div class="expand-img"></div>
                  &lt;!&ndash; <img src="/src/assets/logo.png" alt="" class="expand-img"> &ndash;&gt;
                </div>
                <div class="ep-oneright">
                  &lt;!&ndash; 项目名称  及 地址&ndash;&gt;
                  <span class="spantop">{{ rowExpand.name }}</span>
                  <span class="spanbottom">{{ rowExpand.address }}</span>
                </div>
              </el-col>
              <el-col :span="9" class="expand-two">
                <div class="ep-twoleft">
                  &lt;!&ndash; 项目状态 及 上架或下架&ndash;&gt;
                  <span class="spantop">{{ rowExpand.projectStatusString }}</span>
                  <span class="spanbottom">{{ rowExpand.statusSellString }}</span>
                </div>
                <div class="ep-twoleftc">
                  &lt;!&ndash; 项目类型 及 价格 &ndash;&gt;
                  <span class="spantop">{{ rowExpand.projectTypeString }}</span>
                  <span class="spanbottom">{{ rowExpand.buildingPrice }}元/平米</span>
                </div>
                <div class="ep-tworightc">
                  &lt;!&ndash; 这是 项目负责人 及 电话&ndash;&gt;
                  <span class="spantop">{{rowExpand.leader}}</span>
                  <span class="spanbottom">{{rowExpand.leaderMobile}}</span>
                </div>
                <div class="ep-tworight">
                  &lt;!&ndash; 项目有效类型 及 楼盘性质 &ndash;&gt;
                  <span class="spantop">{{ rowExpand.effectiveTypeOfProjectString }}</span>
                  <span class="spanbottom">{{ rowExpand.buildingPropertyString }}</span>
                </div>
              </el-col>
              <el-col :span="5" class="expand-three">
                <div class="ep-threeleft">
                  <span class="spantop">报备保护期: {{rowExpand.proTimeAgentReport}}天</span>
                  <span class="spancenter">带看保护期: {{rowExpand.proTimeAgentLook}}天</span>
                  <span class="spanbottom">下定保护期: {{rowExpand.proTimeDownPayment}}天</span>
                </div>
                <div class="ep-threeright">
                  &lt;!&ndash; 同步系统 &ndash;&gt;
                  <p v-html="spotFormatter(rowExpand.platformString)"></p>
                </div>
              </el-col>
              <el-col :span="3" class="expand-four">
                <input type="button" value="编辑" class="btn-edit" @click="toEdit">
                <input type="button" value="统计" class="btn-stat" @click="getProjectStatistics('init')">
              </el-col>
            </el-form>
          </el-row>-->
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" min-width="66">
      </el-table-column>
      <el-table-column label="省份" prop="province" min-width="66">
      </el-table-column>
      <el-table-column label="城市" prop="city" min-width="66">
      </el-table-column>
      <el-table-column label="片区" prop="area" min-width="84">
      </el-table-column>
      <el-table-column label="商圈" prop="businessDistrict" min-width="96">
      </el-table-column>
      <el-table-column label="项目名称" prop="b_name" min-width="240">
      </el-table-column>
      <el-table-column label="项目状态" prop="project_state" min-width="76">
      </el-table-column>
      <el-table-column label="项目类型" prop="project_type" min-width="94">
      </el-table-column>
      <el-table-column label="价格" prop="building_price" min-width="144">
      </el-table-column>
      <el-table-column label="项目驻场" prop="e_name" min-width="120">
      </el-table-column>
      <el-table-column label="驻场电话" prop="mobile" min-width="120">
      </el-table-column>
      <el-table-column label="项目有效类型" prop="customer_type" min-width="116">
      </el-table-column>
      <el-table-column label="楼盘性质" prop="building_property">
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="prev, pager, next,  total, sizes, jumper"
      :total="count">
    </el-pagination>

    <!--单击弹出 项目编辑 模态框  -->
    <el-dialog title="项目编辑" :visible.sync="EditVisible" :before-close="handleClose" class="dialog-info" top="40px">
      <span class="projectlist-dialog-smtitle">[{{editProject_title}}]</span>
      <el-tabs type="border-card">
        <!-- 基本信息表单 -->
        <el-tab-pane label="基本信息" class="base-info">
          <el-form :model="editDialogform" :inline="true" :rules="rules" ref="editForm" label-position="left">
            <!-- 供求类型 -->
            <div class="form-row-info other-type">
              <div class="info-content">
                <el-form-item label="项目类型:" prop="projectType">
                  <el-radio-group v-model="editDialogform.projectType" v-if="dictionary['111']">
                    <el-radio v-for="item in dictionary['111'].children" :label="item.key" :key="item.key">{{item.value}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="项目状态:" prop="projectState">
                  <el-radio-group v-model="editDialogform.projectState" v-if="dictionary['117']">
                    <el-radio v-for="(item,key) in dictionary['117'].children" :key="key" :label="item.key">{{item.value}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div class="form-row-info other-type">
              <div class="info-content">
                <el-form-item required>
                  <el-col :span="11">
                    <el-form-item label="项目编号:">
                      <p style="min-width:232px;">{{editDialogform.projectNumber}}</p>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="项目名称:" prop="name">
                      <el-input v-model="editDialogform.name"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item required>
                  <el-col :span="11">
                    <el-form-item label="所属省份:" prop="provinceId">
                      <el-select v-model="editDialogform.provinceId" @change="addProvinceChange">
                        <el-option v-for="value in cityList" :key="value.ID" :label="value.ProvinceName"
                                   :value="value.ID"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="所属城市:" prop="cityId">
                      <el-select v-model="editDialogform.cityId" @change="addCityChange" ref="province">
                        <el-option v-for="value in allCity" :key="value.CityID" :label="value.CityName"
                                   :value="value.CityID"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item required>
                  <el-col :span="11">
                    <el-form-item label="所属区域:" prop="areaId">
                      <el-select v-model="editDialogform.areaId" @change="addAreaChange">
                        <el-option v-for="value in allArea" :key="value.ID" :label="value.AreaName"
                                   :value="value.ID"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="所属商圈:" prop="businessDistrictId">
                      <el-select v-model="editDialogform.businessDistrictId" @change="businessChange">
                        <el-option v-for="value in allBusiness" :key="value.ShangQuanName" :label="value.ShangQuanName"
                                   :value="value.ID"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-col :span="10">
                <el-form-item label="项目地址:" prop="address">
                  <el-input v-model="editDialogform.address"></el-input>
                </el-form-item>
                 </el-col>
                <el-form-item label="项目价格:" prop="buildingPrice">
                  <el-input v-model="editDialogform.buildingPrice">
                    <template slot="append">元/平方</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="地图坐标:" prop="coordinate" class="map-location">
                  <el-input v-model="editDialogform.coordinate"></el-input>
                  <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" class="a-coord">拾取坐标</a>
                </el-form-item>
                <el-form-item label="项目负责人:" prop="leader">
                  <el-input v-model="editDialogform.leader"></el-input>
                </el-form-item>
                <el-form-item label="负责人电话:" prop="leaderMobile">
                  <el-input v-model="editDialogform.leaderMobile" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="建筑类型:" prop="buildingType">
                  <!-- <el-radio-group v-model="editDialogform.buildingType" v-if="dictionary['135']">
                    <el-radio v-for="item in dictionary['135'].children" :label="item.key">{{item.value}}</el-radio>
                  </el-radio-group> -->
                   <el-checkbox-group v-model="editDialogform.buildingType" v-if="dictionary['135']">
                    <el-checkbox v-for="(item,key) in dictionary['135'].children" :key="key" :label="item.key">{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item label="楼盘性质:" prop="buildingProperty">
                  <el-radio-group v-model="editDialogform.buildingProperty" v-if="dictionary['208']">
                    <el-radio v-for="(item,key) in dictionary['208'].children" :key="key" :label="item.key">{{item.value}}</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="楼盘特色:" prop="features">
                  <el-checkbox-group v-model="editDialogform.features" v-if="dictionary['149']">
                    <el-checkbox v-for="(item,key) in dictionary['149'].children" :key="key" :label="item.key" name="type">{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否上架:" prop="statusSell">
                  <el-radio-group v-model="editDialogform.statusSell" v-if="dictionary['123']">
                    <el-radio v-for="(item,key) in dictionary['123'].children" :key="key" :label="item.key">{{item.value}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="基础设施:" prop="infrastructure">
                  <el-checkbox-group v-model="editDialogform.infrastructure" v-if="dictionary['160']">
                    <el-checkbox v-for="(item,key) in dictionary['160'].children" :key="key" :label="item.key" name="type">{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <!-- <el-form-item label="同步系统:" prop="platform">
                  <el-checkbox-group v-model="editDialogform.platform" v-if="dictionary['145']">
                    <el-checkbox v-for="item in dictionary['145'].children" :label="item.key" name="type">{{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item> -->
              </div>
            </div>
          </el-form>
          <!--<el-form :model="editDialogform" :rules="projectEditRules" ref="baseinfoRules" :inline="true"
                   label-width="80px" label-position="left">
            <el-form-item label="项目类型:" prop="projectType">
              <el-radio-group v-model="editDialogform.projectType" v-if="dictionary['111']">
                <el-radio v-for="item in dictionary['111'].children" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="项目状态:" prop="projectStatus">
              <el-radio-group v-model="editDialogform.projectState" v-if="dictionary['117']">
                <el-radio v-for="item in dictionary['117'].children" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="项目编号:">
              <p>125552325455555</p>
            </el-form-item>
            <el-form-item label="项目名称:" prop="activityName" class="fr">
              <el-input v-model="editDialogform.name"></el-input>
            </el-form-item>
            <el-form-item label="所属省市:" prop="province">
              <el-select v-model="editDialogform.provinceId" @change="addProvinceChange">
                <el-option v-for="value in cityList" :key="value.ID" :label="value.ProvinceName"
                           :value="value.ID"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="city">
              <el-select v-model="editDialogform.cityId" @change="addCityChange">
                <el-option v-for="value in allCity" :key="value.CityID" :label="value.CityName"
                           :value="value.CityID"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属区域:" prop="area">
              <el-select v-model="editDialogform.areaId" @change="addAreaChange">
                <el-option v-for="value in allArea" :key="value.ID" :label="value.AreaName"
                           :value="value.ID"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属商圈:" prop="businessArea" class="fr">
              <el-select v-model="editDialogform.businessDistrictId">
                <el-option v-for="value in allBusiness" :key="value.ShangQuanName" :label="value.ShangQuanName"
                           :value="value.ID"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目价格:" prop="projectPrice">
              <el-input v-model="editDialogform.buildingPrice"></el-input>
            </el-form-item>
            <el-form-item label="项目地址:" prop="projectAddress">
              <el-input v-model="editDialogform.address"></el-input>
            </el-form-item>
            <el-form-item label="地图坐标:" prop="mapCoordinates">
              <el-input v-model="editDialogform.coordinate"></el-input>
              <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" class="a-coord">拾取坐标</a>
            </el-form-item>
            <el-form-item label="项目负责人:" prop="chargePerson" label-width="100px">
              <el-input v-model="editDialogform.leader"></el-input>
            </el-form-item>
            <el-form-item label="负责人电话:" prop="chargePhone" label-width="100px" class="fr">
              <el-input v-model="editDialogform.leaderMobile"></el-input>
            </el-form-item>
            <el-form-item label="建筑类型:" prop="buildingType">
              <el-radio-group v-model="editDialogform.buildingType" v-if="dictionary['135']">
                <el-radio v-for="item in dictionary['135'].children" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="楼盘性质:" prop="floorNature">
              <el-radio-group v-model="editDialogform.buildingProperty" v-if="dictionary['208']">
                <el-radio v-for="item in dictionary['208'].children" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="楼盘特色:" prop="floorFeatures">
              <el-checkbox-group v-model="editDialogform.features" v-if="dictionary['149']">
                <el-checkbox v-for="item in dictionary['149'].children" :label="item.key" name="type">{{item.value}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="是否上架:" prop="isPutaway" style="width: 500px">
              <el-radio-group v-model="editDialogform.statusSell" v-if="dictionary['123']">
                <el-radio v-for="item in dictionary['123'].children" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="基础设施:" prop="infrastructure">
              <el-checkbox-group v-model="editDialogform.infrastructure" v-if="dictionary['160']">
                <el-checkbox v-for="item in dictionary['160'].children" :label="item.key" name="type">{{item.value}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="同步系统:" prop="sameStep">
              <el-checkbox-group v-model="editDialogform.platform" v-if="dictionary['145']">
                <el-checkbox v-for="item in dictionary['145'].children" :label="item.key" name="type">{{item.value}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>-->
        </el-tab-pane>
        <!-- 销售信息表单 -->
        <el-tab-pane label="销售信息" class="sell-form">
          <el-form :model="editDialogform" :rules="rules" ref="sellinfoRules" :inline="true"
                   label-width="80px">
            <el-form-item label="开 发 商:" prop="developers">
              <el-input v-model="editDialogform.developer" maxlength=50 placeholder="最多输入50个字符"></el-input>
            </el-form-item>
            <el-form-item label="投  资  商:" prop="investor">
              <el-input v-model="editDialogform.investors" maxlength=50 placeholder="最多输入50个字符"></el-input>
            </el-form-item>
            <el-form-item label="开盘时间:" prop="openTime">
              <el-input v-model="editDialogform.openingTime" maxlength=20 placeholder="最多输入20个字符"></el-input>
            </el-form-item>
            <el-form-item label="物业公司:" prop="company">
              <el-input v-model="editDialogform.propertyCompany" maxlength=50 placeholder="最多输入50个字符"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="phone">
              <el-input v-model="editDialogform.salesPhone" maxlength=15 placeholder="最多输入15个字符"></el-input>
            </el-form-item>
            <el-form-item label="楼 层 数:">
              <el-input v-model="editDialogform.numberOfFloor" maxlength=10 placeholder="最多输入10个字符"></el-input>
            </el-form-item>
            <el-form-item label="项目简介:" prop="brief" class="project_intro">
              <el-input type="textarea" v-model="editDialogform.projectProfile" maxlength=500 placeholder="最多输入500个字符"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 保护期表单 -->
        <el-tab-pane label="保护期" class="protection-time">
          <el-form :model="editDialogform" :rules="rules" ref="protectionRules" label-position="left">
            <div class="form-row-info">
              <div class="info-content label-init">
                <el-form-item required>
                  <el-col :span="11">
                    <el-form-item label="项目有效类型:" prop="customerType">
                      <el-select v-model="editDialogform.customerType" size="mini" v-if="dictionary['126']">
                        <el-option v-for="(item,key) in dictionary['126'].children" :key="key" :label="item.value" :value="item.key"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="佣金:">
                      <el-input v-model="editDialogform.moneyUnit" type="textarea" maxlength=50></el-input>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item required>
                   <el-col :span="11">
                    <el-form-item label="佣金规则:">
                      <el-input v-model="editDialogform.moneyDes" type="textarea" maxlength=300></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="报备保护期:" prop="proTimeAgentReport">
                      <el-input v-model="editDialogform.proTimeAgentReport" ></el-input>
                      <span class="projectList_time">小时</span>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item required>
                   <el-col :span="11">
                    <el-form-item label="报备规则:">
                      <el-input v-model="editDialogform.reportRule" type="textarea" maxlength=500></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="带看保护期:" prop="proTimeAgentLook">
                      <el-input v-model="editDialogform.proTimeAgentLook"></el-input>
                      <span class="projectList_time">小时</span>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-col :span="11">
                    <el-form-item label="下定保护期:">
                      <el-input v-model="editDialogform.proTimeDownPayment"></el-input>
                      <span class="projectList_time">小时</span>
                    </el-form-item>
                  </el-col>
              </div>
               <!-- <div class="info-content label-init">
                <el-form-item required>
                  <el-col :span="11">
                    <el-form-item label="项目有效类型:" prop="customerType">
                      <el-select v-model="editDialogform.customerType" size="mini" v-if="dictionary['126']">
                        <el-option v-for="item in dictionary['126'].children" :label="item.value" :value="item.key"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="佣金:">
                      <el-input v-model="editDialogform.moneyUnit" type="textarea" maxlength=50></el-input>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item required>
                   <el-col :span="11">
                    <el-form-item label="报备保护期:" prop="proTimeAgentReport">
                      <el-input v-model="editDialogform.proTimeAgentReport" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="报备规则:">
                      <el-input v-model="editDialogform.reportRule" type="textarea" maxlength=500></el-input>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item required>
                   <el-col :span="11">
                    <el-form-item label="带看保护期:" prop="proTimeAgentLook">
                      <el-input v-model="editDialogform.proTimeAgentLook"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="下定保护期:">
                      <el-input v-model="editDialogform.proTimeDownPayment"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </div> -->
            </div>
          </el-form>
        </el-tab-pane>
        <!-- 合同信息表单 -->
        <el-tab-pane label="合同信息" class="contract-form">
          <el-form :model="editDialogform" :rules="rules" ref="contractRules" label-position="right"
                   label-width="100px">
            <el-form-item label="公司全称:" prop="company">
              <el-input v-model="editDialogform.contractCompanName"></el-input>
            </el-form-item>
            <el-form-item label="公司税号:" prop="dutyNumber">
              <el-input v-model="editDialogform.contractEin"></el-input>
            </el-form-item>
            <el-form-item label="票别:" prop="ticketType">
              <el-radio-group v-model="editDialogform.contractEinKind" v-if="dictionary['129']">
                <el-radio v-for="(item,key) in dictionary['129'].children" :key="key" :label="item.key">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="开户行及账号:" prop="bankNumber">
              <el-input v-model="editDialogform.contractBank"></el-input>
            </el-form-item>
            <el-form-item label="地址及电话:" prop="adressPhone">
              <el-input v-model="editDialogform.contractAddress"></el-input>
            </el-form-item>
            <el-form-item label="合同截止日期:">
               <el-date-picker
                  v-model="editDialogform.timeOfEnd"
                  type="date"
                  placeholder="选择日期"
                  format= "yyyy-MM-dd"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="合同到期下架:" v-show="editDialogform.timeOfEnd">
              <el-checkbox label="合同到期下架" v-model="editDialogform.lowerFrame"></el-checkbox>
            </el-form-item>
            <el-form-item label="结佣标准:" prop="commission">
              <el-input type="textarea" v-model="editDialogform.contractKnotCommission"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div class="card-footer">
        <el-button type="primary" @click="submitEditForm" class="pop-submitbtn">确 定</el-button>
        <el-button @click="closeEditWindow" class="el-button--cancel pop-cancelbtn">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 单击统计 弹出 项目统计 模态框 -->
    <el-dialog title="项目统计" :visible.sync="statisticsVisible" :before-close="handleClose" class="dialog-info total-dialog">
      <!--<span class="projectlist-dialog-smtitle">{{!statisticsTableData.buildingName?'':statisticsTableData.buildingName}}</span>-->
      <ul class="total-dialog-tool">
        <li>
          <span>统计类型:</span>
          <el-select v-model="SearchStatisticsForm.type" v-if="dictionary['350']">
            <el-option v-for="(item,key) in dictionary['350'].children" :key="key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </li>
        <li>
          <span>统计时间:</span>
          <el-select v-model="SearchStatisticsForm.day" v-if="dictionary['359']" @change="projectTimeChange">
            <el-option v-for="(item,key) in dictionary[359].children" :key="key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </li>
        <li>
          <el-date-picker
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="dataRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="projectTimesChange">
          </el-date-picker>
        </li>
        <li>
          <el-button type="primary" @click="searchStatistics">查询</el-button>
        </li>
      </ul>
      <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="统计类型">
          <el-select v-model="SearchStatisticsForm.type" v-if="dictionary['350']">
            <el-option v-for="item in dictionary['350'].children" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计时间">
          <el-select v-model="SearchStatisticsForm.day" v-if="dictionary['359']">
            <el-option v-for="item in dictionary[359].children" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            type="dates"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="dataRange"
            placeholder="选择一个或多个日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchStatistics">查询</el-button>
        </el-form-item>
      </el-form>-->
      <div class="total-dialog-content">
        <strong>统计说明: </strong>当前项目&nbsp;{{ currentPhase }}&nbsp;总共{{ statisticsTable.info }}客户
        <span>{{countSum}}</span> 位,其中<span v-if="hadUnsubscribeShow" class="hadUnsubscribeShow">{{ statisticsTable.msg }}<i> {{ statisticsCount.return }}</i> 位,</span>{{ statisticsTable.valid }}
        <span>{{statisticsCount.valid}}</span> {{ statisticsTable.unit }}
      </div>
      <div class="statistics-table" v-if="statisticsTableData.list">
        <el-table :data="statisticsTableData.list">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column property="employeeName" :label="statisticsTable.employeeName" width="180"></el-table-column>
          <el-table-column property="customerName" label="客户名称" width="120"></el-table-column>
          <el-table-column property="time" :label="statisticsTable.time" width="200"></el-table-column>
          <el-table-column property="money" :label="statisticsTable.amount" v-if="amountTJShow"></el-table-column>
          <el-table-column property="state" :label="statisticsTable.state" v-if="stateTJShow"></el-table-column>
        </el-table>
      </div>
      <!-- 项目统计分页器 -->
      <el-pagination
        @size-change="handleSizeChangeTJ"
        @current-change="handleCurrentChangeTJ"
        :current-page="SearchStatisticsForm.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="SearchStatisticsForm.pageSize"
        layout="prev, pager, next,  total, sizes, jumper"
        :total="countSum">
      </el-pagination>
      <!--<div class="statistics-closebtn">
        <button type="primary" @click="statisticsVisible = false" class="close-btn">关 闭</button>
      </div>-->
    </el-dialog>
    <!-- 双击表格行弹出 项目明细 模态框 -->
    <el-dialog title="项目明细" :visible.sync="detailVisible" class="dialog-info detail-dialog" top="40px">
      <!--<span class="projectlist-dialog-smtitle">[铁建集团凯德1818中心]</span>-->
      <div class="detail-box">
        <div class="detail-left">
          <div class="detailleft-title">
            <strong class="wordinfo">基本信息</strong>
            <button class="el-icon-edit-outline btn-edit" @click="toEdit(rowExpand.name)">编辑</button>
          </div>
          <div class="detailleft-center">
            <ul>
              <li>
                <span>项目编号: </span>
                <p>{{ rowExpand.projectNumber }}</p>
              </li>
              <li>
                <span>项目名称: </span>
                <p>{{ rowExpand.name }}</p>
              </li>
              <li>
                <span>区域范围: </span>
                <p>{{ rowExpand.city}}-{{rowExpand.area}}</p>
              </li>
              <li>
                <span>项目价格: </span>
                <p>{{ rowExpand.buildingPrice}}</p>
              </li>
              <li>
                <span>项目地址: </span>
                <p>{{ rowExpand.address}}</p>
              </li>
              <li>
                <span>楼盘性质: </span>
                <p>{{ rowExpand.buildingPropertyString}}</p>
              </li>
              <li>
                <span>项目类型: </span>
                <p>{{ rowExpand.projectTypeString}}</p>
              </li>
              <li>
                <span>项目状态: </span>
                <p>{{ rowExpand.projectStatusString}}</p>
              </li>
              <li>
                <span>上架状态: </span>
                <p>{{ rowExpand.statusSellString}}</p>
              </li>
              <!-- <li>
                <span>同步系统: </span>
                <p>{{ rowExpand.platformString}}</p>
              </li> -->
            </ul>
          </div>
          <div class="detailleft-title">
            <strong class="wordinfo">保护期</strong>
          </div>
          <div class="detailleft-bottom">
            <ul>
              <li>
                <span>项目有效类型: </span>
                <p>{{ rowExpand.effectiveTypeOfProjectString}}</p>
              </li>
              <li>
                <span>佣金: </span>
                <p>{{ rowExpand.moneyUnit}}</p>
              </li>
               <li>
                <span>佣金规则: </span>  
                <p>{{ rowExpand.moneyDes}}</p>
              </li>
              <li>
                <span>报备保护期: </span>
                <p>{{ rowExpand.proTimeAgentReport}}小时</p>
              </li>
              <li>
                <span>报 备 规 则: </span>
                <p>{{ rowExpand.reportRule}}</p>
              </li>
              <li>
                <span>带看保护期: </span>
                <p>{{ rowExpand.proTimeAgentLook}}小时</p>
              </li>
              <li>
                <span>下定保护期: </span>
                <p>{{ rowExpand.proTimeDownPayment}}小时</p>
              </li>
            </ul>
          </div>
        </div>
        <el-tabs type="border-card" class="detail-right">
          <el-tab-pane label="人员分配" class="allot-person">
            <i class="icon icon-fenpei" @click="clickPutPerson">分配人员</i>
            <el-table :data="personTableData">
              <el-table-column prop="title" label="职务">
              </el-table-column>
              <el-table-column prop="name" label="姓名">
              </el-table-column>
              <el-table-column prop="mobile" label="联系电话">
              </el-table-column>
               <el-table-column prop="meaning" label="电话规则">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div @click="setPhoneRule(scope.row)" style="color:#66b1ff;">设置电话规则</div>
                  <!-- <el-button @click.native.prevent="setPhoneRule(scope.row)" type="text">
                    设置电话规则
                  </el-button> -->
                  <el-button @click.native.prevent="confirmDelRowindex(scope.row)" type="text">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="合同信息" class="contract-info">
            <ul class="contract-message">
              <li>
                <label>公司全称:</label>
                {{ rowExpand.contractCompanName }}
              </li>
              <li>
                <label>公司税号:</label>
                {{ rowExpand.contractEin }}
              </li>
              <li>
                <label>票别:</label>
                {{ rowExpand.contractEinKindString}}
              </li>
              <li>
                <label>开户行及账号:</label>
                {{ rowExpand.contractBank}}
              </li>
              <li>
                <label>地址及电话:</label>
                {{ rowExpand.contractAddress}}
              </li>
              <li>
                <label>结佣标准:</label>
                {{ rowExpand.contractKnotCommission}}
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="图库" class="img-store">
            <ul class="gallery-tab">
              <li @click="getProImages(1)" :class="[gallery.kind===1?'active':'']">全部</li>
              <li @click="getProImages(2)" :class="[gallery.kind===2?'active':'']">户型图</li>
            </ul>
            <div class="cover-image">
              <ul class="gallery-window-map" style="flex-wrap:wrap;">
                <li v-for="item in gallery.galleryList" :key="item.imgId" @mouseenter="galleryActive=item.imgId" @mouseleave="galleryActive=''">
                  <img :src="item.img_url" alt="">
                  <p v-show="galleryActive===item.imgId" :class="[item.cover?'cover-image-active':'']"><span @click="coverImageOne(item)" v-show="gallery.kind===1">{{!item.cover?'设为封面':'当前封面'}}</span><span @click="delImageOne(item)">X</span></p>
                </li>
                <li class="gallery-window-opera" @click="toUpload(2)">
                  <!--<p class="gallery-window-opera" @click="toUpload(2)">-->
                    <input type="file" @change="upLoadImage" v-show="false" ref="upload1">
                    <span>+</span>
                  <!--</p>-->
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="操作日志">
            <el-table :data="operateLogTableData" height="600">
              <el-table-column prop="update_time" label="操作时间">
              </el-table-column>
              <el-table-column prop="function_name" label="功能名称">
              </el-table-column>
              <el-table-column label="内容">
                <template slot-scope="scope">
                   <div v-html="scope.row.log_content"></div>
                </template>
              </el-table-column>
              <el-table-column label="操作人">
                <template slot-scope="scope">
                  <div>{{scope.row.operator}} ({{scope.row.department}} )</div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 点击设置电话规则弹出框 -->
      <el-dialog title="设置电话规则" :visible.sync="setPhoneRuleBox" width="400px" append-to-body
                 class="person-visible phone_rule">
       <div class="input-group">
          <label>项目驻场:</label>
          <span>{{setPhoneRuleForm.name}}</span>
        </div>
        <div class="input-group">
          <label>职务:</label>
          <span>{{setPhoneRuleForm.title}}</span>
        </div>
        <div class="input-group">
          <label>电话报备规则:</label>
           <el-radio-group v-model="setPhoneRuleForm.mobile_show_mode">
                <el-radio :label="2">前三后四</el-radio>
                <el-radio :label="1">全部显示</el-radio>
            </el-radio-group>
        </div>
        <p class="input-group-opera">
          <el-button @click="submitPhoneRule" class="pop-submitbtn">确 定</el-button>
          <el-button @click="setPhoneRuleBox=false" class="pop-cancelbtn">取 消</el-button>
        </p>
      </el-dialog>
      <!-- 内层 分配人员模态框 -->
      <el-dialog width="30%" title="分配人员" :visible.sync="personVisible" append-to-body class="person-visible">
        <div class="input-group">
          <label class="input-group-target">项目驻场:</label>
          <input type="text" v-model="allotPersonForm.name" @keyup.enter="searchStaff">
          <ul class="staff-search-list" v-if="staffSearch.length>0">
            <li v-for="item in staffSearch" :key="item.e_id" @click="setProjectPerson(item)">{{item.e_name}}  <span style="color:#ccc"> ({{item.cd_name}} -- {{item.d_name}}) </span></li>
          </ul>
        </div>
        <div class="input-group">
          <label>电话:</label>
          <span>{{allotPersonForm.phone}}</span>
        </div>
        <div class="input-group">
          <label>职务:</label>
          <span>{{allotPersonForm.duty}}</span>
        </div>
        <div class="input-group">
          <label>电话报备规则:</label>
           <el-radio-group v-model="allotPersonForm.mobileShowMode">
                <el-radio :label="2">前三后四</el-radio>
                <el-radio :label="1">全部显示</el-radio>
            </el-radio-group>
        </div>
        <p class="input-group-opera">
          <el-button @click="submitAllotPersonForm" class="pop-submitbtn">确 定</el-button>
          <el-button @click="cancelAllotPersonForm" class="pop-cancelbtn">取 消</el-button>
        </p>
        <!--<el-form :model="allotPersonForm" :rules="allotPersonRules" ref="allotPersonForm" label-width="100px">
          <el-form-item label="项目驻场:" prop="projectPreson">
            <el-input v-model="allotPersonForm.projectPreson"></el-input>
          </el-form-item>
          <el-form-item label="电话:">
            {{allotPersonForm.phone}}
          </el-form-item>
          <el-form-item label="职务:">
            {{allotPersonForm.duty}}
          </el-form-item>
          <div class="projectlist-btn-okCancel">
            <el-button type="primary" @click="submitAllotPersonForm( 'allotPersonForm' )">确 定</el-button>
            <el-button @click="personVisible = false" class="el-button&#45;&#45;cancel">取 消</el-button>
          </div>
        </el-form>-->
        <!-- 确认删除 模态框 -->
      </el-dialog>
      <!-- 确认删除 模态框 -->
      <el-dialog title="提示" :visible.sync="confirmDelVisible" width="400px" append-to-body
                 class="projectlist-confirm-del">
        <span class="word-del-confirm">
          <i class="el-icon-info"></i>您确定删除吗?</span>
        <span slot="footer" class="dialog-footer projectlist-btn-okCancel">
          <el-button type="primary" @click="confirmDeleteRow(delRowindex,personTableData)" class="pop-submitbtn">确 定</el-button>
          <el-button type="cancel" @click="confirmDelVisible = false" class="pop-cancelbtn">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <!-- 户型图弹窗html start -->
    <el-dialog title="户型图" :visible.sync="houseTypeVisible" class="dialog-info houseType-dialog" :before-close="handleClose">
        <div class="houseType-wrapper">
        <span>123</span>

        </div>
        <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="houseTypeVisible = false">取 消</el-button>
            <el-button type="primary" @click="houseTypeVisible = false">确 定</el-button>
        </span> -->
    </el-dialog>
    <!-- 户型图弹窗html end -->
  </div>
</template>

<script src="./projectList.js"></script>
<style lang='scss' scoped src="./projectList.scss"></style>

