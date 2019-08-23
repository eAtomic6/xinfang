const showTableData=[
        {
            name:"编号",
            value:"name",
            width:"120"
        },
        {
            name:"项目名称",
            value:"p_name",
            width:"120"
        },
        {
            name:"回款公司全称",
            value:"reason_type",
            width:"120"
        },
        {
            name:"审核状态",
            value:"follow_reason",
            width:"100"
        },
        {
            name:"开票金额",
            value:"pc_name",
            width:"110"
        },
        {
            name:"成交人",
            value:"create_time",
            width:"90"
        },
        {
            name:"提交人姓名",
            value:"b_name",
            width:"90"
        },
        {
            name:"提交人电话",
            value:"state",
            width:"120"
        },
        {
            name:"提交审核时间",
            value:"expect_look_time",
            width:"120"
        },
        {
            name:"房号",
            value:"pro_time_agent_report",
            width:"100",
        },
        {
            name:"收佣客户数",
            value:"remaining",
            width:"90"
        },
        {
            name:"最早认购时间",
            value:"pc_name",
            width:"120"
        },
        {
            name:"最早签约时间",
            value:"pc_name",
            width:"120"
        },
        {
            name:"合同总价",
            value:"pc_name",
            width:"120"
        },
        {
            name:"佣金金额",
            value:"pc_name",
            width:"120"
        },
        {
            name:"本次收佣金额",
            value:"pc_name",
            width:"120"
        }
        
]
const RULE = {
    // followType:[{ required: true, message: '请选择跟进类型', trigger: 'change' }],
    // reasonType:[{ required: true, message: '请选择跟进目的', trigger: 'change' }],
    // followReason:[{ required: true, message: '请输入备注说明', trigger: 'blur' }],
    level:[{required: true, message: '请选择客户等级', trigger: 'change' }],
}
export {showTableData,RULE}