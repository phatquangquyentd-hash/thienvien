
const APP_NAME = 'WEB APP QUẢN LÝ HOẠT ĐỘNG CHÙA';
const APP_VERSION = '8.8.8-gallery-delete';
const HEADER_ROW = 3, FIRST_ROW = 4, FIRST_COL = 2;
// Favicon công khai, sử dụng trực tiếp từ website; không cần Drive hay ScriptProperties.
const FAVICON_URL = 'https://taitemp.shop/wp-content/uploads/2026/10/Bieu-tuong-chua-vang-va-hoa-sen.png';

const MODULES = {
  employees:{sheet:'Nhân sự',id:'Mã nhân sự',prefix:'NS',title:'Nhân sự',icon:'groups',required:['Họ tên','Bộ phận'],fields:['Mã nhân sự','Họ tên','Bộ phận','Chức danh','Số điện thoại','Email','Ngày bắt đầu','Trạng thái','Ghi chú'],dates:['Ngày bắt đầu'],phone:['Số điện thoại'],cats:{'Bộ phận':'Danh mục bộ phận','Chức danh':'Danh mục chức danh'}},
  people:{sheet:'Phật tử',id:'Mã người',prefix:'PT',title:'Phật tử',icon:'diversity_3',required:['Họ tên'],fields:['Mã người','Họ tên','Pháp danh','Ngày sinh','Giới tính','Số điện thoại','Email','Địa chỉ','Người liên hệ','Số điện thoại liên hệ','Ảnh File ID','Trạng thái','Ghi chú'],dates:['Ngày sinh'],phone:['Số điện thoại','Số điện thoại liên hệ']},
  classes:{sheet:'Nhóm lớp',id:'Mã nhóm lớp',prefix:'LOP',title:'Nhóm lớp',icon:'school',required:['Tên nhóm lớp','Loại nhóm lớp'],fields:['Mã nhóm lớp','Tên nhóm lớp','Loại nhóm lớp','Mã nhân sự phụ trách','Địa điểm','Lịch sinh hoạt','Mức học phí','Trạng thái'],numbers:['Mức học phí'],cats:{'Loại nhóm lớp':'Danh mục nhóm lớp'},refs:{'Mã nhân sự phụ trách':'employees'}},
  memberships:{sheet:'Thành viên lớp',id:'Mã thành viên',prefix:'TV',title:'Thành viên lớp',icon:'how_to_reg',required:['Mã người','Mã nhóm lớp','Ngày tham gia'],fields:['Mã thành viên','Mã người','Mã nhóm lớp','Ngày tham gia','Vai trò','Ngày kết thúc','Trạng thái'],dates:['Ngày tham gia','Ngày kết thúc'],refs:{'Mã người':'people','Mã nhóm lớp':'classes'},bulk:true,unique:['Mã người','Mã nhóm lớp']},
  sessions:{sheet:'Buổi sinh hoạt',id:'Mã buổi',prefix:'BUOI',title:'Buổi sinh hoạt',icon:'event_note',required:['Mã nhóm lớp','Ngày sinh hoạt'],fields:['Mã buổi','Mã nhóm lớp','Ngày sinh hoạt','Giờ bắt đầu','Giờ kết thúc','Nội dung','Địa điểm','Mã nhân sự phụ trách','Lịch lặp','Trạng thái'],dates:['Ngày sinh hoạt'],refs:{'Mã nhóm lớp':'classes','Mã nhân sự phụ trách':'employees'},bulk:true},
  attendance:{sheet:'Điểm danh',id:'Mã điểm danh',prefix:'DD',title:'Điểm danh',icon:'fact_check',required:['Mã buổi','Mã người','Trạng thái điểm danh'],fields:['Mã điểm danh','Mã buổi','Mã người','Trạng thái điểm danh','Thời gian điểm danh','Mã nhân sự điểm danh','Ghi chú'],dates:['Thời gian điểm danh'],refs:{'Mã buổi':'sessions','Mã người':'people','Mã nhân sự điểm danh':'employees'},bulk:true,unique:['Mã buổi','Mã người']},
  exams:{sheet:'Kỳ thi',id:'Mã kỳ thi',prefix:'KT',title:'Kỳ thi',icon:'workspace_premium',required:['Tên kỳ thi','Ngày thi','Mã nhóm lớp'],fields:['Mã kỳ thi','Tên kỳ thi','Ngày thi','Mã nhóm lớp','Địa điểm','Nội dung','Mã nhân sự phụ trách','Link YouTube chung','Trạng thái'],dates:['Ngày thi'],refs:{'Mã nhóm lớp':'classes','Mã nhân sự phụ trách':'employees'}},
  results:{sheet:'Kết quả thi',id:'Mã kết quả',prefix:'KQ',title:'Kết quả thi',icon:'military_tech',required:['Mã kỳ thi','Mã người'],fields:['Mã kết quả','Mã kỳ thi','Mã người','Nội dung bài thi','Điểm','Kết quả','Cấp đai','Thành tích','Nhận xét','Mã nhân sự xác nhận','Link YouTube cá nhân'],numbers:['Điểm'],refs:{'Mã kỳ thi':'exams','Mã người':'people','Mã nhân sự xác nhận':'employees'},bulk:true,unique:['Mã kỳ thi','Mã người']},
  fees:{sheet:'Khoản học phí',id:'Mã khoản học phí',prefix:'HP',title:'Khoản học phí',icon:'payments',required:['Mã người','Mã nhóm lớp','Kỳ học phí'],fields:['Mã khoản học phí','Mã người','Mã nhóm lớp','Kỳ học phí','Ngày đến hạn','Học phí gốc','Miễn giảm','Phải thu','Trạng thái'],dates:['Ngày đến hạn'],periods:['Kỳ học phí'],numbers:['Học phí gốc','Miễn giảm','Phải thu'],computed:['Phải thu'],system:['Trạng thái'],refs:{'Mã người':'people','Mã nhóm lớp':'classes'},bulk:true,unique:['Mã người','Mã nhóm lớp','Kỳ học phí']},
  slots:{sheet:'Vị trí Nhà Linh',id:'Mã vị trí',prefix:'VT',title:'Vị trí Nhà Linh',icon:'grid_view',required:['Khu','Dãy','Ô'],fields:['Mã vị trí','Khu','Dãy','Tầng','Ô','Trạng thái','Mã hồ sơ hiện tại'],system:['Mã hồ sơ hiện tại'],unique:['Khu','Dãy','Tầng','Ô']},
  memorials:{sheet:'Nhà Linh',id:'Mã hồ sơ',prefix:'NL',title:'Hồ sơ Nhà Linh',icon:'temple_buddhist',required:['Họ tên người được thờ'],fields:['Mã hồ sơ','Họ tên người được thờ','Pháp danh','Ngày mất','Mã vị trí','Gia chủ','Thân nhân','Số điện thoại','Địa chỉ','Ngày tiếp nhận','Trạng thái','Ghi chú'],dates:['Ngày mất','Ngày tiếp nhận'],phone:['Số điện thoại'],refs:{'Mã vị trí':'slots'}},
  memorialHistory:{sheet:'Lịch sử Nhà Linh',id:'Mã lịch sử',prefix:'LSNL',title:'Lịch sử Nhà Linh',icon:'history',fields:['Mã lịch sử','Mã hồ sơ','Ngày thay đổi','Mã vị trí cũ','Mã vị trí mới','Nội dung','Mã nhân sự thực hiện'],dates:['Ngày thay đổi'],refs:{'Mã hồ sơ':'memorials','Mã vị trí cũ':'slots','Mã vị trí mới':'slots','Mã nhân sự thực hiện':'employees'},readOnly:true},
  events:{sheet:'Sự kiện',id:'Mã sự kiện',prefix:'SK',title:'Sự kiện',icon:'event',required:['Tên sự kiện','Ngày dương lịch'],fields:['Mã sự kiện','Tên sự kiện','Loại sự kiện','Ngày dương lịch','Ngày âm lịch','Giờ bắt đầu','Giờ kết thúc','Địa điểm','Mã nhân sự phụ trách','Nội dung','Trạng thái'],dates:['Ngày dương lịch'],cats:{'Loại sự kiện':'Danh mục sự kiện'},refs:{'Mã nhân sự phụ trách':'employees'}},
  guests:{sheet:'Khách mời',id:'Mã khách',prefix:'KM',title:'Khách mời',icon:'contact_mail',required:['Họ tên'],fields:['Mã khách','Họ tên','Đơn vị','Chức danh','Số điện thoại','Email','Địa chỉ','Nhóm khách','Ghi chú'],phone:['Số điện thoại'],cats:{'Nhóm khách':'Danh mục nhóm khách'}},
  invitations:{sheet:'Thư mời',id:'Mã thư mời',prefix:'TM',title:'Thư mời',icon:'mark_email_unread',required:['Mã sự kiện'],fields:['Mã thư mời','Mã sự kiện','Mã khách','Mã hồ sơ Nhà Linh','Ngày gửi','Kênh gửi','Phản hồi','Trạng thái tham dự','Mã nhân sự phụ trách'],dates:['Ngày gửi'],refs:{'Mã sự kiện':'events','Mã khách':'guests','Mã hồ sơ Nhà Linh':'memorials','Mã nhân sự phụ trách':'employees'},bulk:true},
  tasks:{sheet:'Công việc',id:'Mã công việc',prefix:'CV',title:'Công việc',icon:'task_alt',required:['Tiêu đề','Ngày giao','Ngày hạn'],fields:['Mã công việc','Mã việc cha','Mã sự kiện','Tiêu đề','Nội dung','Nhóm việc','Mã người giao','Mã nhân sự phụ trách','Ngày giao','Ngày hạn','Mức ưu tiên','Tiến độ','Trạng thái','Mã người duyệt','Ngày duyệt'],dates:['Ngày giao','Ngày hạn','Ngày duyệt'],numbers:['Tiến độ'],cats:{'Nhóm việc':'Danh mục loại công việc'},refs:{'Mã việc cha':'tasks','Mã sự kiện':'events','Mã người giao':'employees','Mã nhân sự phụ trách':'employees','Mã người duyệt':'employees'},bulk:true},
  intakes:{sheet:'Tiếp nhận',id:'Mã tiếp nhận',prefix:'TN',title:'Tiếp nhận',icon:'support_agent',required:['Ngày tiếp nhận','Loại yêu cầu','Họ tên'],fields:['Mã tiếp nhận','Ngày tiếp nhận','Loại yêu cầu','Họ tên','Số điện thoại','Email','Ngày mong muốn','Nội dung','Mã người liên quan','Mã công việc','Mã nhân sự xử lý','Trạng thái','Kết quả'],dates:['Ngày tiếp nhận','Ngày mong muốn'],phone:['Số điện thoại'],cats:{'Loại yêu cầu':'Danh mục tiếp nhận'},refs:{'Mã người liên quan':'people','Mã công việc':'tasks','Mã nhân sự xử lý':'employees'},bulk:true},
  feeReceipts:{sheet:"Thu học phí",id:"Mã thu học phí",prefix:"THP",title:"Thu học phí",icon:"payments",fields:["Mã thu học phí","Mã khoản học phí","Ngày thu","Số tiền","Phương thức","Mã quỹ","Mã giao dịch tài chính","Mã nhân sự thu","Trạng thái"],required:["Mã khoản học phí","Ngày thu","Số tiền","Mã quỹ"],dates:["Ngày thu"],numbers:["Số tiền"],system:["Mã giao dịch tài chính"],refs:{"Mã khoản học phí":"fees","Mã quỹ":"funds","Mã nhân sự thu":"employees"},bulk:true},
  feeRefunds:{sheet:"Hoàn học phí",id:"Mã hoàn học phí",prefix:"HHP",title:"Hoàn học phí",icon:"currency_exchange",fields:["Mã hoàn học phí","Mã khoản học phí","Mã thu học phí","Ngày đề nghị","Số tiền hoàn","Lý do","Người đề nghị","Người duyệt","Ngày duyệt","Mã giao dịch tài chính","Trạng thái"],required:["Mã khoản học phí","Ngày đề nghị","Số tiền hoàn"],dates:["Ngày đề nghị","Ngày duyệt"],numbers:["Số tiền hoàn"],system:["Mã giao dịch tài chính"],refs:{"Mã khoản học phí":"fees","Mã thu học phí":"feeReceipts","Người đề nghị":"employees","Người duyệt":"employees"}},
  stores:{sheet:"Kho",id:"Mã kho",prefix:"KHO",title:"Kho",icon:"warehouse",fields:["Mã kho","Tên kho","Loại kho","Địa điểm","Mã người quản lý","Trạng thái"],required:["Tên kho"],refs:{"Mã người quản lý":"employees"},cats:{"Loại kho":"Danh mục loại kho"}},
  vendors:{sheet:"Nhà cung cấp",id:"Mã nhà cung cấp",prefix:"NCC",title:"Nhà cung cấp",icon:"factory",fields:["Mã nhà cung cấp","Tên nhà cung cấp","Người liên hệ","Số điện thoại","Email","Địa chỉ","Nhóm cung cấp","Trạng thái"],required:["Tên nhà cung cấp"],phone:["Số điện thoại"]},
  products:{sheet:"Sản phẩm",id:"Mã SKU",prefix:"SKU",title:"Sản phẩm",icon:"inventory_2",fields:["Mã SKU","Tên sản phẩm","Nhóm sản phẩm","Dòng sản phẩm","Size","Màu hoặc cấp đai","Đơn vị tính","Giá nhập","Giá bán","Tồn tối thiểu","Ảnh File ID","Trạng thái"],required:["Tên sản phẩm","Dòng sản phẩm"],numbers:["Giá nhập","Giá bán","Tồn tối thiểu"],cats:{"Nhóm sản phẩm":"Danh mục ngành hàng","Đơn vị tính":"Danh mục đơn vị tính"}},
  purchases:{sheet:"Phiếu nhập",id:"Mã phiếu nhập",prefix:"PN",title:"Phiếu nhập",icon:"move_to_inbox",fields:["Mã phiếu nhập","Ngày nhập","Mã nhà cung cấp","Mã kho","Tổng tiền","Đã thanh toán","Còn nợ","Mã nhân sự lập","Ngày xác nhận","Trạng thái","Ghi chú"],required:["Ngày nhập","Mã nhà cung cấp","Mã kho"],dates:["Ngày nhập","Ngày xác nhận"],numbers:["Tổng tiền","Đã thanh toán","Còn nợ"],computed:["Tổng tiền","Còn nợ"],refs:{"Mã nhà cung cấp":"vendors","Mã kho":"stores","Mã nhân sự lập":"employees"}},
  purchaseItems:{sheet:"Chi tiết nhập",id:"Mã chi tiết nhập",prefix:"CTN",title:"Chi tiết nhập",icon:"list_alt",fields:["Mã chi tiết nhập","Mã phiếu nhập","Mã SKU","Số lượng","Đơn giá nhập","Thành tiền"],required:["Mã phiếu nhập","Mã SKU","Số lượng"],numbers:["Số lượng","Đơn giá nhập","Thành tiền"],computed:["Thành tiền"],refs:{"Mã phiếu nhập":"purchases","Mã SKU":"products"},bulk:true},
  orders:{sheet:"Đơn bán",id:"Mã đơn bán",prefix:"DB",title:"Đơn bán",icon:"shopping_bag",fields:["Mã đơn bán","Ngày đặt","Nguồn đơn","Mã người mua","Tên người mua","Số điện thoại","Mã kho","Tổng tiền","Đã thu","Còn nợ","Ngày hẹn thanh toán","Mã nhân sự xác nhận","Trạng thái"],required:["Ngày đặt","Tên người mua","Mã kho"],dates:["Ngày đặt","Ngày hẹn thanh toán"],numbers:["Tổng tiền","Đã thu","Còn nợ"],phone:["Số điện thoại"],computed:["Tổng tiền","Đã thu","Còn nợ"],refs:{"Mã người mua":"people","Mã kho":"stores","Mã nhân sự xác nhận":"employees"}},
  orderItems:{sheet:"Chi tiết bán",id:"Mã chi tiết bán",prefix:"CTB",title:"Chi tiết bán",icon:"receipt_long",fields:["Mã chi tiết bán","Mã đơn bán","Mã SKU","Size","Số lượng","Đơn giá bán","Thành tiền"],required:["Mã đơn bán","Mã SKU","Số lượng"],numbers:["Số lượng","Đơn giá bán","Thành tiền"],computed:["Thành tiền"],refs:{"Mã đơn bán":"orders","Mã SKU":"products"},bulk:true},
  orderReceipts:{sheet:"Thu tiền bán",id:"Mã thu bán",prefix:"TTB",title:"Thu tiền bán",icon:"payments",fields:["Mã thu bán","Mã đơn bán","Ngày thu","Số tiền","Phương thức","Mã quỹ","Mã giao dịch tài chính","Mã nhân sự thu","Trạng thái"],required:["Mã đơn bán","Ngày thu","Số tiền","Mã quỹ"],dates:["Ngày thu"],numbers:["Số tiền"],system:["Mã giao dịch tài chính"],refs:{"Mã đơn bán":"orders","Mã quỹ":"funds","Mã nhân sự thu":"employees"},bulk:true},
  returns:{sheet:"Đổi trả hàng",id:"Mã đổi trả",prefix:"DT",title:"Đổi trả hàng",icon:"published_with_changes",fields:["Mã đổi trả","Mã đơn bán","Ngày đổi trả","Mã SKU trả","Số lượng trả","Tình trạng hàng","Mã SKU đổi","Số lượng đổi","Lý do","Hướng xử lý","Tiền điều chỉnh","Mã phiếu kho","Trạng thái"],required:["Mã đơn bán","Ngày đổi trả","Mã SKU trả","Số lượng trả"],dates:["Ngày đổi trả"],numbers:["Số lượng trả","Số lượng đổi","Tiền điều chỉnh"],system:["Mã phiếu kho"],refs:{"Mã đơn bán":"orders","Mã SKU trả":"products","Mã SKU đổi":"products"},cats:{"Tình trạng hàng":"Danh mục tình trạng hàng"}},
  transfers:{sheet:"Chuyển kho",id:"Mã phiếu chuyển",prefix:"CK",title:"Chuyển kho",icon:"swap_horiz",fields:["Mã phiếu chuyển","Ngày chuyển","Mã kho xuất","Mã kho nhận","Mã nhân sự lập","Ngày xác nhận","Trạng thái"],required:["Ngày chuyển","Mã kho xuất","Mã kho nhận"],dates:["Ngày chuyển","Ngày xác nhận"],refs:{"Mã kho xuất":"stores","Mã kho nhận":"stores","Mã nhân sự lập":"employees"}},
  transferItems:{sheet:"Chi tiết chuyển kho",id:"Mã chi tiết chuyển",prefix:"CTC",title:"Chi tiết chuyển kho",icon:"dynamic_form",fields:["Mã chi tiết chuyển","Mã phiếu chuyển","Mã SKU","Số lượng"],required:["Mã phiếu chuyển","Mã SKU","Số lượng"],numbers:["Số lượng"],refs:{"Mã phiếu chuyển":"transfers","Mã SKU":"products"},bulk:true},
  stocktakes:{sheet:"Kiểm kê kho",id:"Mã kiểm kê",prefix:"KK",title:"Kiểm kê kho",icon:"fact_check",fields:["Mã kiểm kê","Ngày kiểm kê","Mã kho","Mã SKU","Tồn hệ thống","Tồn thực tế","Chênh lệch","Mã nhân sự kiểm kê","Mã người duyệt","Trạng thái"],required:["Ngày kiểm kê","Mã kho","Mã SKU","Tồn thực tế"],dates:["Ngày kiểm kê"],numbers:["Tồn hệ thống","Tồn thực tế","Chênh lệch"],computed:["Tồn hệ thống","Chênh lệch"],refs:{"Mã kho":"stores","Mã SKU":"products","Mã nhân sự kiểm kê":"employees","Mã người duyệt":"employees"},bulk:true},
  stockLedger:{sheet:"Sổ kho",id:"Mã giao dịch kho",prefix:"SGK",title:"Sổ kho",icon:"inventory",fields:["Mã giao dịch kho","Ngày giao dịch","Loại giao dịch","Mã phiếu nguồn","Mã kho","Mã SKU","Số lượng nhập","Số lượng xuất","Mã nhân sự thực hiện","Trạng thái"],dates:["Ngày giao dịch"],numbers:["Số lượng nhập","Số lượng xuất"],refs:{"Mã kho":"stores","Mã SKU":"products","Mã nhân sự thực hiện":"employees"},readOnly:true},
  supplies:{sheet:"Vật tư",id:"Mã vật tư",prefix:"VTU",title:"Vật tư",icon:"handyman",fields:["Mã vật tư","Tên vật tư","Loại vật tư","Đơn vị tính","Mã kho","Tồn tối thiểu","Vị trí","Mã nhân sự quản lý","Trạng thái"],required:["Tên vật tư","Mã kho"],numbers:["Tồn tối thiểu"],refs:{"Mã kho":"stores","Mã nhân sự quản lý":"employees"},cats:{"Loại vật tư":"Danh mục vật tư","Đơn vị tính":"Danh mục đơn vị tính"}},
  supplyIssues:{sheet:"Xuất dùng vật tư",id:"Mã xuất dùng",prefix:"XDV",title:"Xuất dùng vật tư",icon:"construction",fields:["Mã xuất dùng","Ngày xuất","Mã vật tư","Mã kho","Số lượng","Mục đích","Mã công việc","Mã nhân sự nhận","Mã người xác nhận","Trạng thái"],required:["Ngày xuất","Mã vật tư","Mã kho","Số lượng"],dates:["Ngày xuất"],numbers:["Số lượng"],refs:{"Mã vật tư":"supplies","Mã kho":"stores","Mã công việc":"tasks","Mã nhân sự nhận":"employees","Mã người xác nhận":"employees"},bulk:true},
  loans:{sheet:"Mượn trả dụng cụ",id:"Mã phiếu mượn",prefix:"MT",title:"Mượn trả dụng cụ",icon:"handshake",fields:["Mã phiếu mượn","Mã vật tư","Mã người mượn","Ngày mượn","Số lượng mượn","Ngày hẹn trả","Số lượng đã trả","Trạng thái"],required:["Mã vật tư","Mã người mượn","Ngày mượn","Số lượng mượn"],dates:["Ngày mượn","Ngày hẹn trả"],numbers:["Số lượng mượn","Số lượng đã trả"],computed:["Số lượng đã trả"],refs:{"Mã vật tư":"supplies","Mã người mượn":"people"},bulk:true},
  loanReturns:{sheet:"Lần trả dụng cụ",id:"Mã lần trả",prefix:"LT",title:"Lần trả dụng cụ",icon:"assignment_return",fields:["Mã lần trả","Mã phiếu mượn","Ngày trả","Số lượng trả","Mã nhân sự nhận","Ghi chú"],required:["Mã phiếu mượn","Ngày trả","Số lượng trả"],dates:["Ngày trả"],numbers:["Số lượng trả"],refs:{"Mã phiếu mượn":"loans","Mã nhân sự nhận":"employees"},bulk:true},
  assets:{sheet:"Tài sản",id:"Mã tài sản",prefix:"TS",title:"Tài sản",icon:"devices_other",fields:["Mã tài sản","Tên tài sản","Loại tài sản","Hãng","Model","Serial","Ngày mua","Giá mua","Mã nhà cung cấp","Vị trí","Mã nhân sự quản lý","Ngày hết bảo hành","Trạng thái"],required:["Tên tài sản","Loại tài sản"],dates:["Ngày mua","Ngày hết bảo hành"],numbers:["Giá mua"],refs:{"Mã nhà cung cấp":"vendors","Mã nhân sự quản lý":"employees"},cats:{"Loại tài sản":"Danh mục tài sản"}},
  warranties:{sheet:"Bảo hành tài sản",id:"Mã bảo hành",prefix:"BH",title:"Bảo hành tài sản",icon:"verified_user",fields:["Mã bảo hành","Mã tài sản","Ngày gửi","Ngày nhận lại","Đơn vị bảo hành","Nội dung","Kết quả","Chi phí","Trạng thái"],required:["Mã tài sản","Ngày gửi"],dates:["Ngày gửi","Ngày nhận lại"],numbers:["Chi phí"],refs:{"Mã tài sản":"assets"}},
  maintenance:{sheet:"Bảo dưỡng tài sản",id:"Mã bảo dưỡng",prefix:"BD",title:"Bảo dưỡng tài sản",icon:"build_circle",fields:["Mã bảo dưỡng","Mã tài sản","Ngày thực hiện","Nội dung","Chi phí","Đơn vị thực hiện","Ngày dự kiến tiếp theo","Km thực hiện","Mã giao dịch tài chính","Trạng thái"],required:["Mã tài sản","Ngày thực hiện"],dates:["Ngày thực hiện","Ngày dự kiến tiếp theo"],numbers:["Chi phí","Km thực hiện"],system:["Mã giao dịch tài chính"],refs:{"Mã tài sản":"assets"}},
  vehicles:{sheet:"Phương tiện",id:"Mã xe",prefix:"XE",title:"Phương tiện",icon:"directions_car",fields:["Mã xe","Biển số","Loại xe","Hãng xe","Mã tài xế phụ trách","Trạng thái"],required:["Biển số"],unique:["Biển số"],refs:{"Mã tài xế phụ trách":"employees"},cats:{"Loại xe":"Danh mục phương tiện"}},
  trips:{sheet:"Chuyến đi",id:"Mã chuyến đi",prefix:"CD",title:"Chuyến đi",icon:"route",fields:["Mã chuyến đi","Mã xe","Mã tài xế","Ngày đi","Giờ đi","Ngày về","Giờ về","Điểm đi","Điểm đến","Mục đích","Số người","Mã nhân sự phụ trách","Trạng thái"],required:["Mã xe","Ngày đi","Điểm đi","Điểm đến"],dates:["Ngày đi","Ngày về"],numbers:["Số người"],refs:{"Mã xe":"vehicles","Mã tài xế":"employees","Mã nhân sự phụ trách":"employees"},bulk:true},
  parking:{sheet:"Lượt giữ xe",id:"Mã lượt xe",prefix:"GX",title:"Lượt giữ xe",icon:"local_parking",fields:["Mã lượt xe","Biển số","Loại xe","Giờ vào","Giờ ra","Vị trí gửi","Mã người nhận","Mã người trả","Phí giữ xe","Mã giao dịch tài chính","Ảnh File ID","Trạng thái"],required:["Biển số","Giờ vào"],dateTimes:["Giờ vào","Giờ ra"],numbers:["Phí giữ xe"],system:["Mã giao dịch tài chính"],refs:{"Mã người nhận":"employees","Mã người trả":"employees"},cats:{"Loại xe":"Danh mục phương tiện"},bulk:true},
  funds:{sheet:"Quỹ",id:"Mã quỹ",prefix:"QUY",title:"Quỹ",icon:"account_balance_wallet",fields:["Mã quỹ","Tên quỹ","Loại quỹ","Mã người phụ trách","Trạng thái"],required:["Tên quỹ"],refs:{"Mã người phụ trách":"employees"},cats:{"Loại quỹ":"Danh mục quỹ"}},
  finance:{sheet:"Giao dịch tài chính",id:"Mã giao dịch",prefix:"GD",title:"Giao dịch tài chính",icon:"account_balance",fields:["Mã giao dịch","Ngày giao dịch","Loại giao dịch","Nhóm thu chi","Nguồn phát sinh","Mã chứng từ nguồn","Mã quỹ","Số tiền","Phương thức","Đối tượng","Mã nhân sự thực hiện","Trạng thái","Nội dung"],required:["Ngày giao dịch","Loại giao dịch","Mã quỹ","Số tiền"],dates:["Ngày giao dịch"],numbers:["Số tiền"],refs:{"Mã quỹ":"funds","Mã nhân sự thực hiện":"employees"},cats:{"Nhóm thu chi":"Danh mục thu chi"}},
  files:{sheet:"Tài liệu upload",id:"Mã tài liệu",prefix:"TL",title:"Tài liệu upload",icon:"folder_copy",fields:["Mã tài liệu","Ngày tải lên","Phân hệ","Mã bản ghi liên kết","Loại tài liệu","Tên file","MIME type","Dung lượng KB","File ID","Link xem","Link tải","Mã người tải","Trạng thái"],dates:["Ngày tải lên"],numbers:["Dung lượng KB"],readOnly:true},
  emails:{sheet:"Lịch sử email",id:"Mã lượt gửi",prefix:"EM",title:"Lịch sử email",icon:"mark_email_read",fields:["Mã lượt gửi","Ngày gửi","Nhóm nhắc việc","Kỳ gửi","Người nhận","Tiêu đề","Số mục","Trạng thái","Thông báo lỗi","Mã đợt gửi","Ngày tổng hợp","Loại bản tin","Mã nhân sự","Số quá hạn","Số đến hạn hôm nay","Số sắp đến hạn","Số chờ xác nhận","Mã chống gửi trùng","Thời điểm hoàn tất"],dates:["Ngày gửi","Ngày tổng hợp"],dateTimes:["Thời điểm hoàn tất"],periods:["Kỳ gửi"],numbers:["Số mục","Số quá hạn","Số đến hạn hôm nay","Số sắp đến hạn","Số chờ xác nhận"],readOnly:true},
  audit:{sheet:"Nhật ký thao tác",id:"Mã nhật ký",prefix:"NK",title:"Nhật ký thao tác",icon:"history",fields:["Mã nhật ký","Thời gian","Mã tài khoản","Phân hệ","Hành động","Mã bản ghi","Dữ liệu trước","Dữ liệu sau","Kết quả"],dates:["Thời gian"],readOnly:true}
};
// Người dùng ở tab database đã tạo, mật khẩu lưu dạng text theo yêu cầu.
// Không preload mật khẩu sang client. Vai trò và trạng thái là lựa chọn cố định.
MODULES.users={sheet:'Người dùng',id:'Mã tài khoản',prefix:'TK',title:'Người dùng',icon:'manage_accounts',
  required:['Tên đăng nhập','Vai trò','Trạng thái'],
  fields:['Mã tài khoản','Tên đăng nhập','Mật khẩu','Mã nhân sự','Mã người liên kết','Vai trò','Trạng thái','Ngày tạo'],
  dates:['Ngày tạo'],system:['Ngày tạo'],refs:{'Mã nhân sự':'employees','Mã người liên kết':'people'}};

const CHOICES = {
  'Trạng thái':['Hoạt động','Đang xử lý','Đã xác nhận','Hoàn thành','Tạm dừng','Đã hủy','Chờ duyệt','Chưa bắt đầu','Đang thực hiện','Chờ xác nhận','Ngừng hoạt động'],
  'Giới tính':['Nam','Nữ','Khác'],
  'Vai trò':['Học viên','Phụ huynh','Võ sinh','Giáo viên','Thành viên','Phụ trách'],
  'Trạng thái điểm danh':['Có mặt','Vắng','Có phép','Đi muộn'],
  'Mức ưu tiên':['Thấp','Bình thường','Cao','Khẩn cấp'],
  'Trạng thái tham dự':['Chưa phản hồi','Đồng ý tham dự','Từ chối','Đã tham dự','Vắng mặt'],
  'Kênh gửi':['Trực tiếp','Email','Điện thoại','Thư giấy','Khác'],
  'Kết quả':['Đạt','Không đạt','Chờ đánh giá','Đang xử lý','Hoàn thành']
};
const LINK_LABELS={employees:'Họ tên',people:'Họ tên',classes:'Tên nhóm lớp',sessions:'Nội dung',exams:'Tên kỳ thi',slots:'Khu',memorials:'Họ tên người được thờ',events:'Tên sự kiện',guests:'Họ tên',tasks:'Tiêu đề'};
const REVERSE_REFERENCE = {
  employees:['Nhóm lớp:Mã nhân sự phụ trách','Buổi sinh hoạt:Mã nhân sự phụ trách','Kỳ thi:Mã nhân sự phụ trách','Thư mời:Mã nhân sự phụ trách','Công việc:Mã người giao','Công việc:Mã nhân sự phụ trách','Tiếp nhận:Mã nhân sự xử lý','Người dùng:Mã nhân sự'],
  people:['Thành viên lớp:Mã người','Điểm danh:Mã người','Kết quả thi:Mã người','Khoản học phí:Mã người','Tiếp nhận:Mã người liên quan'],
  classes:['Thành viên lớp:Mã nhóm lớp','Buổi sinh hoạt:Mã nhóm lớp','Kỳ thi:Mã nhóm lớp','Khoản học phí:Mã nhóm lớp'],
  sessions:['Điểm danh:Mã buổi'],exams:['Kết quả thi:Mã kỳ thi'],
  slots:['Nhà Linh:Mã vị trí','Lịch sử Nhà Linh:Mã vị trí cũ','Lịch sử Nhà Linh:Mã vị trí mới'],
  memorials:['Vị trí Nhà Linh:Mã hồ sơ hiện tại','Lịch sử Nhà Linh:Mã hồ sơ','Thư mời:Mã hồ sơ Nhà Linh'],
  events:['Thư mời:Mã sự kiện','Công việc:Mã sự kiện'],guests:['Thư mời:Mã khách'],tasks:['Công việc:Mã việc cha','Tiếp nhận:Mã công việc']
};

/* ===================== PART 3 - XÁC THỰC / PHÂN QUYỀN ===================== */
const AUTH_TOKEN_PREFIX='chua_v8_auth_';
const AUTH_EPOCH_PREFIX='chua_v8_epoch_';
const AUTH_ABSOLUTE_MS=7*24*60*60*1000;
const AUTH_IDLE_MS=24*60*60*1000;
const AUTH_ROLES=['Admin','Quản lý','Nhân sự','Phụ huynh','Viewer'];
const AUTH_RESERVED=new Set(['users','audit','emails','finance','funds','feeRefunds']);
const AUTH_PUBLIC=new Set(['classes','sessions','events']);
const AUTH_PARENT=new Set(['people','memberships','classes','sessions','attendance','exams','results','fees','feeReceipts','events']);
const AUTH_FINANCIAL=new Set(['finance','funds','feeRefunds','feeReceipts','orderReceipts']);
function authProperties_(){return PropertiesService.getScriptProperties();}
function normalizeRole_(raw){
  var s=String(raw||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(['admin','quan tri','quan tri vien','administrator'].includes(s))return 'Admin';
  if(['quan ly','manager'].includes(s))return 'Quản lý';
  if(['nhan su','nhan vien','staff','user'].includes(s))return 'Nhân sự';
  if(['phu huynh','parent','gia dinh'].includes(s))return 'Phụ huynh';
  if(['viewer','chi xem','nguoi xem','khach'].includes(s))return 'Viewer';
  return '';
}
function publicActor_(a){return {userId:a.userId,username:a.username,role:a.role,employeeId:a.employeeId||'',
  personId:a.personId||'',displayName:a.displayName||a.username};}
function authError_(message){return new Error('AUTH_REQUIRED: '+(message||'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.'));}
function authAccount_(id){return rows_('users').find(function(x){return String(x['Mã tài khoản'])===String(id);})||null;}
function readActorFromAccount_(user){
  var staff=rows_('employees').find(function(x){return String(x['Mã nhân sự'])===String(user['Mã nhân sự']||'');});
  var role=normalizeRole_(user['Vai trò']);if(!role)throw authError_('Vai trò tài khoản chưa hợp lệ.');
  return {userId:String(user['Mã tài khoản']),username:String(user['Tên đăng nhập']),role:role,
    employeeId:String(user['Mã nhân sự']||''),personId:String(user['Mã người liên kết']||''),
    displayName:staff?.['Họ tên']||user['Tên đăng nhập']};
}
function getEpoch_(id){return authProperties_().getProperty(AUTH_EPOCH_PREFIX+id)||'0';}
function invalidateAccountSessions_(id){authProperties_().setProperty(AUTH_EPOCH_PREFIX+id,Utilities.getUuid());}
function checkLogin(username,password){
  username=String(username||'').trim();password=String(password||'');
  if(!username||!password)throw new Error('Vui lòng nhập tên đăng nhập và mật khẩu.');
  if(username.length>120||password.length>500)throw new Error('Thông tin đăng nhập không hợp lệ.');
  var cache=CacheService.getScriptCache(),failKey='chua_v8_fail_'+Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,username.toLowerCase())).slice(0,36);
  if(Number(cache.get(failKey)||0)>=8)throw new Error('Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.');
  var record=rows_('users').find(function(x){return String(x['Tên đăng nhập']||'').trim().toLowerCase()===username.toLowerCase();});
  if(!record||String(record['Mật khẩu']||'')!==password){cache.put(failKey,String(Number(cache.get(failKey)||0)+1),900);throw new Error('Tài khoản hoặc mật khẩu không đúng.');}
  if(String(record['Trạng thái']||'').trim()!=='Hoạt động')throw new Error('Tài khoản đang bị khóa hoặc chưa được kích hoạt.');
  var actor=readActorFromAccount_(record),token=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');
  var now=Date.now(),state={id:actor.userId,epoch:getEpoch_(actor.userId),created:now,last:now};
  authProperties_().setProperty(AUTH_TOKEN_PREFIX+token,JSON.stringify(state));cache.remove(failKey);
  try{auditAuth_(actor,'Đăng nhập','Đăng nhập thành công');}catch(e){}
  return {success:true,token:token,session:publicActor_(actor),version:APP_VERSION};
}
function requireSession_(token){
  token=String(token||'').trim();if(!/^[a-f0-9]{64}$/i.test(token))throw authError_();
  var props=authProperties_(),key=AUTH_TOKEN_PREFIX+token,raw=props.getProperty(key);if(!raw)throw authError_();
  var s;try{s=JSON.parse(raw);}catch(e){props.deleteProperty(key);throw authError_();}
  var now=Date.now();if(now-s.created>AUTH_ABSOLUTE_MS||now-s.last>AUTH_IDLE_MS){props.deleteProperty(key);throw authError_('Phiên đăng nhập đã hết hạn.');}
  if(getEpoch_(s.id)!==s.epoch){props.deleteProperty(key);throw authError_('Tài khoản vừa được cập nhật, vui lòng đăng nhập lại.');}
  var user=authAccount_(s.id);
  if(!user||String(user['Trạng thái']||'')!=='Hoạt động'){props.deleteProperty(key);throw authError_('Tài khoản đã bị khóa hoặc xóa.');}
  var actor=readActorFromAccount_(user);
  // Tránh ghi PropertiesService trên mọi request; cấp mới nếu cách lần trước >= 5 phút.
  if(now-s.last>300000){s.last=now;props.setProperty(key,JSON.stringify(s));}
  return actor;
}
function getSessionInfo(token){return {success:true,session:publicActor_(requireSession_(token)),version:APP_VERSION};}
function logout(token){
  var actor=null;try{actor=requireSession_(token);}catch(e){}
  if(token)authProperties_().deleteProperty(AUTH_TOKEN_PREFIX+String(token));
  if(actor)try{auditAuth_(actor,'Đăng xuất','Đăng xuất hệ thống');}catch(e){}
  return {success:true};
}
function canRead_(actor,key){
  if(actor.role==='Admin')return Boolean(MODULES[key]);
  if(actor.role==='Quản lý')return Boolean(MODULES[key])&&key!=='users';
  if(actor.role==='Nhân sự')return Boolean(MODULES[key])&&!AUTH_RESERVED.has(key);
  if(actor.role==='Viewer')return AUTH_PUBLIC.has(key);
  if(actor.role==='Phụ huynh')return AUTH_PARENT.has(key);
  return false;
}
function canWrite_(actor,key,operation){
  if(!canRead_(actor,key)||MODULES[key]?.readOnly)return false;
  if(actor.role==='Admin')return true;
  if(actor.role==='Quản lý')return key!=='audit'&&key!=='users'&&key!=='emails'&&key!=='stockLedger';
  if(actor.role==='Nhân sự'){
    if(['employees','slots','categories','funds','finance','feeRefunds','stockLedger','users'].includes(key))return false;
    return true;
  }
  return false;
}
function authPermission_(actor,key,action){
  var yes=action==='read'?canRead_(actor,key):canWrite_(actor,key,action);
  if(!yes)throw new Error('Bạn không có quyền '+(action==='read'?'xem':'thao tác')+' phân hệ này.');
}
function publicPermissions_(actor){
  var pages=['dashboard','action-center','categories','reports','emailCenter'].filter(function(p){
    if(p==='emailCenter')return actor.role==='Admin'||actor.role==='Quản lý';
    if(p==='categories')return actor.role==='Admin'||actor.role==='Quản lý';
    if(p==='reports')return actor.role==='Admin'||actor.role==='Quản lý';
    if(p==='action-center')return canRead_(actor,'tasks');return true;
  });
  var read=[],write=[],deletes=[];
  Object.keys(MODULES).forEach(function(k){if(canRead_(actor,k)){read.push(k);pages.push(k);}
    if(canWrite_(actor,k,'edit'))write.push(k);
    if(canWrite_(actor,k,'delete')&&(actor.role==='Admin'||actor.role==='Quản lý'))deletes.push(k);
  });
  pages.push('gallery'); // V8.8.5: mọi vai trò đăng nhập có thể xem thư viện, quyền sửa xét riêng tại backend.
  return {role:actor.role,isAdmin:actor.role==='Admin',pages:pages,read:read,write:write,delete:deletes,
    canManageCategories:actor.role==='Admin'||actor.role==='Quản lý',canUpload:write.length>0,
    canDeleteFile:actor.role==='Admin',canSendEmails:actor.role==='Admin'||actor.role==='Quản lý',
    canReport:actor.role==='Admin'||actor.role==='Quản lý'};
}
function parentPersonIds_(actor){
  var result=new Set(String(actor.personId||'').split(/[,;\s]+/).filter(Boolean));
  var sh=getSheet_('Liên kết phụ huynh'),last=sh.getLastRow();if(last>=FIRST_ROW){
    var headers=sh.getRange(3,2,1,Math.max(1,sh.getLastColumn()-1)).getDisplayValues()[0],idx=headers.indexOf('Mã tài khoản'),person=headers.indexOf('Mã võ sinh'),state=headers.indexOf('Trạng thái');
    if(idx>=0&&person>=0)sh.getRange(4,2,last-3,sh.getLastColumn()-1).getDisplayValues().forEach(function(line){
      if(String(line[idx])===actor.userId&&(!line[state]||state<0||!['Tạm khóa','Đã hủy','Không hoạt động'].includes(line[state])))result.add(line[person]);
    });
  }
  return result;
}
function scopeRows_(actor,key,all){
  if(!canRead_(actor,key))return [];
  if(key==='users')return actor.role==='Admin'?all.map(function(u){var x=Object.assign({},u);delete x['Mật khẩu'];return x;}):[];
  if(key==='files'&&actor.role!=='Admin')return all.filter(function(file){
    var related=Object.keys(MODULES).find(function(k){return MODULES[k].sheet===file['Phân hệ'];});
    return related&&canRead_(actor,related)&&file['Trạng thái']!=='Đã xóa';
  });
  if(actor.role!=='Phụ huynh')return all;
  var ids=parentPersonIds_(actor),member=rows_('memberships').filter(function(x){return ids.has(String(x['Mã người']));});
  var classes=new Set(member.map(function(x){return String(x['Mã nhóm lớp']);}));
  var ss=rows_('sessions').filter(function(x){return classes.has(String(x['Mã nhóm lớp']));});
  var sessionIds=new Set(ss.map(function(x){return String(x['Mã buổi']);}));
  var exams=rows_('exams').filter(function(x){return classes.has(String(x['Mã nhóm lớp']));});
  var examIds=new Set(exams.map(function(x){return String(x['Mã kỳ thi']);}));
  var feeIds=new Set(rows_('fees').filter(function(x){return ids.has(String(x['Mã người']));}).map(function(x){return String(x['Mã khoản học phí']);}));
  switch(key){
    case 'people':return all.filter(function(x){return ids.has(String(x['Mã người']));});
    case 'memberships':return all.filter(function(x){return ids.has(String(x['Mã người']));});
    case 'classes':return all.filter(function(x){return classes.has(String(x['Mã nhóm lớp']));});
    case 'sessions':return all.filter(function(x){return sessionIds.has(String(x['Mã buổi']));});
    case 'attendance':return all.filter(function(x){return ids.has(String(x['Mã người']))&&sessionIds.has(String(x['Mã buổi']));});
    case 'exams':return all.filter(function(x){return examIds.has(String(x['Mã kỳ thi']));});
    case 'results':return all.filter(function(x){return ids.has(String(x['Mã người']))&&examIds.has(String(x['Mã kỳ thi']));});
    case 'fees':return all.filter(function(x){return ids.has(String(x['Mã người']));});
    case 'feeReceipts':return all.filter(function(x){return feeIds.has(String(x['Mã khoản học phí']));});
    case 'events':return all.filter(function(x){return x['Trạng thái']!=='Đã hủy';});
    default:return [];
  }
}
function scopeResult_(actor,key,rows){return scopeRows_(actor,key,rows);}
function auditAuth_(actor,action,details){
  try{appendAuto_('audit',{'Thời gian':new Date(),'Mã tài khoản':actor.userId,'Phân hệ':'Hệ thống','Hành động':action,
    'Mã bản ghi':actor.userId,'Dữ liệu trước':'','Dữ liệu sau':details,'Kết quả':'Thành công'});}catch(e){}
}
function validateAccount_(rec,old){
  var name=String(rec['Tên đăng nhập']||'').trim(),pwd=String(rec['Mật khẩu']||'');
  if(!name||!String(rec['Vai trò']||'').trim())throw new Error('Thiếu tên đăng nhập hoặc vai trò.');
  if(!old&&!pwd.trim())throw new Error('Tài khoản mới cần có mật khẩu.');
  if(!AUTH_ROLES.includes(normalizeRole_(rec['Vai trò'])))throw new Error('Vai trò không hợp lệ.');
  rec['Vai trò']=normalizeRole_(rec['Vai trò']);
  rec['Trạng thái']=String(rec['Trạng thái']||'Hoạt động');
  if(!['Hoạt động','Tạm khóa'].includes(rec['Trạng thái']))throw new Error('Trạng thái tài khoản không hợp lệ.');
  if(rows_('users').some(function(x){return String(x['Tên đăng nhập']).trim().toLowerCase()===name.toLowerCase()&&String(x['Mã tài khoản'])!==String(rec['Mã tài khoản']);}))throw new Error('Tên đăng nhập đã tồn tại.');
  if(rec['Mã nhân sự']&&!rows_('employees').some(function(x){return x['Mã nhân sự']===rec['Mã nhân sự'];}))throw new Error('Mã nhân sự không tồn tại.');
  if(rec['Mã người liên kết']&&!rows_('people').some(function(x){return x['Mã người']===rec['Mã người liên kết'];}))throw new Error('Mã người liên kết không tồn tại.');
  if(rec['Vai trò']==='Phụ huynh'&&!rec['Mã người liên kết']){var sh=getSheet_('Liên kết phụ huynh');if(sh.getLastRow()<4)throw new Error('Phụ huynh cần một Mã người liên kết hoặc liên kết phụ huynh hợp lệ.');}
}
// Không xóa tài khoản đang được khai báo ở bảng liên kết phụ huynh.
REVERSE_REFERENCE.users=['Liên kết phụ huynh:Mã tài khoản'];

function doGet() {
  var html=HtmlService.createTemplateFromFile('Index');html.appName=APP_NAME;html.appVersion=APP_VERSION;
  return html.evaluate().setTitle(APP_NAME).setFaviconUrl(FAVICON_URL)
    .addMetaTag('viewport','width=device-width,initial-scale=1,maximum-scale=1');
}
function include(name){return HtmlService.createHtmlOutputFromFile(name).getContent();}
function getDb_(){var ss=SpreadsheetApp.getActiveSpreadsheet();if(!ss)throw new Error('Hãy tạo Apps Script từ file Google Sheet DATABASE V8 (Tiện ích > Apps Script).');return ss;}
function getSheet_(name){var s=getDb_().getSheetByName(name);if(!s)throw new Error('Database thiếu tab "'+name+'".');return s;}
function headerIndex_(sh,fields){
  var end=sh.getLastColumn(),cols=sh.getRange(HEADER_ROW,FIRST_COL,1,Math.max(1,end-FIRST_COL+1)).getDisplayValues()[0],map={};
  cols.forEach(function(h,i){if(h)map[String(h).trim()]=i;});
  fields.forEach(function(f){if(map[f]===undefined)throw new Error('Tab "'+sh.getName()+'" thiếu cột "'+f+'" tại B3.');});
  return map;
}
function fmtValue_(v,field){
  if(Object.prototype.toString.call(v)==='[object Date]')return Utilities.formatDate(v,Session.getScriptTimeZone()||'Asia/Ho_Chi_Minh',/Thời gian|Thời điểm|Giờ vào|Giờ ra/.test(field)?'dd/MM/yyyy HH:mm':'dd/MM/yyyy');
  return v===null||v===undefined?'':v;
}
function rows_(key){
  var cfg=MODULES[key];if(!cfg)throw new Error('Không tìm thấy phân hệ: '+key);
  var sh=getSheet_(cfg.sheet),last=sh.getLastRow();if(last<FIRST_ROW)return [];
  var hm=headerIndex_(sh,cfg.fields),width=sh.getLastColumn()-FIRST_COL+1,raw=sh.getRange(FIRST_ROW,FIRST_COL,last-FIRST_ROW+1,width).getValues();
  return raw.map(function(a){var out={};cfg.fields.forEach(function(f){out[f]=fmtValue_(a[hm[f]],f);});return out;}).filter(function(o){return String(o[cfg.id]||'').trim()!=='';});
}
function readCategories_(){
  var sh=getSheet_('Danh mục'),end=sh.getLastColumn(),last=sh.getLastRow(),headers=sh.getRange(3,2,1,end-1).getDisplayValues()[0],raw=last>=4?sh.getRange(4,2,last-3,end-1).getDisplayValues():[],out={};
  headers.forEach(function(h,i){if(!h)return;out[h]=Array.from(new Set(raw.map(function(r){return String(r[i]||'').trim();}).filter(Boolean)));});
  return out;
}
function clientSchema_(){var out={};Object.keys(MODULES).forEach(function(k){out[k]=Object.assign({},MODULES[k]);});return out;}
// Core only: dữ liệu nghiệp vụ tải một lần, không kèm Drive, Calendar, Mail hay preview.
const DEFERRED_MODULE_KEYS=['files','emails','audit'];
function bootstrapRows_(key){
  // Một lần getValues/sheet bao gồm header B3 và toàn bộ data B4 trở xuống.
  // Tránh 2 lượt đọc riêng header và dữ liệu khi preload nhiều phân hệ.
  var cfg=MODULES[key],sh=getSheet_(cfg.sheet),width=sh.getLastColumn()-FIRST_COL+1;
  if(width<1)throw new Error('Tab "'+cfg.sheet+'" chưa có header B3.');
  var length=Math.max(1,sh.getLastRow()-HEADER_ROW+1);
  var matrix=sh.getRange(HEADER_ROW,FIRST_COL,length,width).getValues();
  var headers=matrix[0].map(function(v){return String(v||'').trim();}),map={};
  headers.forEach(function(h,i){if(h)map[h]=i;});
  cfg.fields.forEach(function(field){if(map[field]===undefined)throw new Error('Tab '+cfg.sheet+' thiếu cột '+field+' tại B3.');});
  return matrix.slice(1).map(function(line){var obj={};cfg.fields.forEach(function(field){obj[field]=fmtValue_(line[map[field]],field);});return obj;})
    .filter(function(obj){return String(obj[cfg.id]||'').trim()!=='';});
}
function getBootstrapData(token){
  var actor=requireSession_(token),permissions=publicPermissions_(actor);
  var result={modules:{},categories:readCategories_(),schema:clientSchema_(),fixedOptions:CHOICES,version:APP_VERSION,
    now:new Date().toISOString(),deferred:DEFERRED_MODULE_KEYS,session:publicActor_(actor),permissions:permissions};
  Object.keys(MODULES).filter(function(k){return canRead_(actor,k)&&DEFERRED_MODULE_KEYS.indexOf(k)<0;}).forEach(function(k){
    result.modules[k]=scopeResult_(actor,k,bootstrapRows_(k));
  });
  return result;
}
function getDeferredData(token){
  var actor=requireSession_(token),data={};DEFERRED_MODULE_KEYS.forEach(function(k){
    if(canRead_(actor,k))data[k]=scopeResult_(actor,k,rows_(k));
  });
  return {success:true,modules:data};
}
function refreshModule(key,token){var actor=requireSession_(token);authPermission_(actor,key,'read');return {key:key,rows:scopeResult_(actor,key,rows_(key))};}
function parseDate_(v){
  if(!v)return null;if(Object.prototype.toString.call(v)==='[object Date]')return isNaN(v.getTime())?null:v;
  var s=String(v).trim(),m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/)||s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if(!m)return null;
  var yr=s[4]==='-'?+m[1]:+m[3],mo=s[4]==='-'?+m[2]:+m[2],dy=s[4]==='-'?+m[3]:+m[1],d=new Date(yr,mo-1,dy);
  return d.getFullYear()===yr&&d.getMonth()===mo-1&&d.getDate()===dy?d:null;
}
function normalizePhone_(v){var s=String(v==null?'':v).replace(/\D/g,'');if(s.startsWith('84')&&s.length>=11)s='0'+s.slice(2);if(!s.startsWith('0')&&s.length===9)s='0'+s;return s;}
function normalizeMoney_(x){
  if(x===''||x==null)return 0;
  if(typeof x==='number'){if(!isFinite(x))throw new Error('Giá trị số không hợp lệ.');return x;}
  var s=String(x).replace(/\s/g,'').trim();
  if(/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s))s=s.replace(/\./g,'').replace(',','.');
  else if(s.indexOf(',')>=0)s=s.replace(/\./g,'').replace(',','.');
  var n=Number(s);if(!isFinite(n))throw new Error('Giá trị số không hợp lệ: '+x);return n;
}
function parseDateTime_(v){
  if(Object.prototype.toString.call(v)==='[object Date]')return isNaN(v.getTime())?null:v;
  var s=String(v||'').trim(),m=s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/)
    ||s.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);
  if(!m)return null;var iso=s.indexOf('T')>=0,y=iso?+m[1]:+m[3],mon=+m[2]-1,d=iso?+m[3]:+m[1],h=+m[4],mi=+m[5];
  var result=new Date(y,mon,d,h,mi,0,0);return result.getFullYear()===y&&result.getMonth()===mon&&result.getDate()===d&&result.getHours()===h&&result.getMinutes()===mi?result:null;
}
function inputToCell_(cfg,f,v){
  if(v==null||v==='')return '';
  if((cfg.dates||[]).includes(f)){var d=parseDate_(v);if(!d)throw new Error('Ngày không hợp lệ ở trường '+f+'.');return d;}
  if((cfg.dateTimes||[]).includes(f)){var dateTime=parseDateTime_(v);if(!dateTime)throw new Error('Thời gian không hợp lệ ở trường '+f+'.');return dateTime;}
  if((cfg.numbers||[]).includes(f))return f==='Điểm'?Number(String(v).replace(',','.')):normalizeMoney_(v);
  if((cfg.phone||[]).includes(f))return normalizePhone_(v);
  var str=String(v).trim();return /^[=+@]/.test(str)?"'"+str:str;
}
function validateEntry_(key,entry,currentRows,refCache){
  var cfg=MODULES[key];(cfg.required||[]).forEach(function(f){if(!String(entry[f]??'').trim())throw new Error('Thiếu trường bắt buộc: '+f);});
  (cfg.dates||[]).forEach(function(f){if(entry[f]&&!parseDate_(entry[f]))throw new Error('Sai ngày tại trường '+f+' (dd/mm/yyyy).');});
  (cfg.dateTimes||[]).forEach(function(f){if(entry[f]&&!parseDateTime_(entry[f]))throw new Error('Sai thời gian tại '+f+' (dd/mm/yyyy HH:mm).');});
  (cfg.periods||[]).forEach(function(f){if(entry[f]&&!/^(0[1-9]|1[0-2])\/\d{4}$/.test(String(entry[f])))throw new Error('Sai kỳ '+f+' (mm/yyyy).');});
  (cfg.numbers||[]).forEach(function(f){if(entry[f]!==''&&entry[f]!=null&&(!isFinite(normalizeMoney_(entry[f]))||normalizeMoney_(entry[f])<0))throw new Error(f+' phải là số không âm.');});
  Object.keys(cfg.refs||{}).forEach(function(f){var v=String(entry[f]||'').trim();if(!v)return;var ref=cfg.refs[f];if(!refCache[ref])refCache[ref]=rows_(ref);if(!refCache[ref].some(function(x){return String(x[MODULES[ref].id])===v;}))throw new Error(f+' không tồn tại: '+v);});
  if(entry.Email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(entry.Email)))throw new Error('Email không hợp lệ.');
  validatePart2Entry_(key,entry,currentRows,refCache);
  if(key==='fees'){
    var origin=normalizeMoney_(entry['Học phí gốc']),discount=normalizeMoney_(entry['Miễn giảm']);if(discount>origin)throw new Error('Miễn giảm không được lớn hơn học phí gốc.');
    entry['Phải thu']=origin-discount;
  }
  if(key==='tasks'){
    var rate=normalizeMoney_(entry['Tiến độ']);if(rate>100)throw new Error('Tiến độ phải từ 0 đến 100.');
    if(entry['Trạng thái']==='Hoàn thành')entry['Tiến độ']=100;
    if(parseDate_(entry['Ngày hạn'])<parseDate_(entry['Ngày giao']))throw new Error('Ngày hạn không được trước ngày giao.');
  }
  if(key==='memberships'&&entry['Ngày kết thúc']&&parseDate_(entry['Ngày kết thúc'])<parseDate_(entry['Ngày tham gia']))throw new Error('Ngày kết thúc không được trước ngày tham gia.');
  if(key==='invitations'&&!entry['Mã khách']&&!entry['Mã hồ sơ Nhà Linh'])throw new Error('Chọn ít nhất một khách mời hoặc hồ sơ Nhà Linh.');
  if((cfg.unique||[]).length){var keyOf=function(r){return cfg.unique.map(function(f){return String(r[f]??'').trim().toLowerCase();}).join('|');};var check=keyOf(entry);
    if(currentRows.some(function(r){return String(r[cfg.id])!==String(entry[cfg.id]||'')&&keyOf(r)===check;}))throw new Error('Bản ghi trùng dữ liệu đã tồn tại ('+cfg.unique.join(', ')+').');
  }
  if(key==='parking'&&String(entry['Trạng thái']||'')==='Đang gửi'){
    var plate=String(entry['Biển số']||'').toUpperCase().replace(/[\s.\-]/g,'');
    if((currentRows||[]).some(function(x){return String(x['Mã lượt xe'])!==String(entry['Mã lượt xe']||'')&&String(x['Trạng thái'])==='Đang gửi'&&String(x['Biển số']||'').toUpperCase().replace(/[\s.\-]/g,'')===plate;}))throw new Error('Biển số này đang có lượt giữ xe chưa trả.');
  }
  if(key==='invitations'){
    var eventId=String(entry['Mã sự kiện']||''),guestId=String(entry['Mã khách']||''),memorialId=String(entry['Mã hồ sơ Nhà Linh']||'');
    if((guestId||memorialId)&&(currentRows||[]).some(function(r){return String(r['Mã thư mời'])!==String(entry['Mã thư mời']||'')&&String(r['Mã sự kiện'])===eventId&&((guestId&&String(r['Mã khách'])===guestId)||(memorialId&&String(r['Mã hồ sơ Nhà Linh'])===memorialId));}))throw new Error('Thư mời của khách/hồ sơ này đã tồn tại trong sự kiện.');
  }
  if(key==='attendance'){
    var s=(refCache.sessions||rows_('sessions')).find(function(v){return String(v['Mã buổi'])===String(entry['Mã buổi']);});
    if(s){var memberships=refCache.memberships||rows_('memberships');if(!memberships.some(function(x){return String(x['Mã nhóm lớp'])===String(s['Mã nhóm lớp'])&&String(x['Mã người'])===String(entry['Mã người']);}))throw new Error('Người này chưa thuộc nhóm lớp của buổi sinh hoạt.');}
  }
  if(key==='memorials'&&entry['Mã vị trí']){
    var occupied=(currentRows||[]).find(function(x){return String(x['Mã vị trí'])===String(entry['Mã vị trí'])&&String(x[cfg.id])!==String(entry[cfg.id]||'')&&!['Đã hủy','Kết thúc'].includes(x['Trạng thái']);});
    if(occupied)throw new Error('Vị trí '+entry['Mã vị trí']+' đang được hồ sơ '+occupied['Mã hồ sơ']+' sử dụng.');
  }
}
function nextKeys_(key,count,existing){var cfg=MODULES[key],max=0;existing.forEach(function(r){var m=String(r[cfg.id]||'').match(/(\d+)$/);if(m)max=Math.max(max,+m[1]);});return Array.from({length:count},function(_,i){return cfg.prefix+String(max+i+1).padStart(5,'0');});}
function getRowIndex_(sh,key,id){var cfg=MODULES[key],h=headerIndex_(sh,cfg.fields),end=sh.getLastRow();if(end<4)return 0;var values=sh.getRange(4,2+h[cfg.id],end-3,1).getDisplayValues();var i=values.findIndex(function(r){return String(r[0]||'').trim()===String(id);});return i<0?0:i+4;}
function writeRow_(key,entry,rowNumber){
  var cfg=MODULES[key],sh=getSheet_(cfg.sheet),h=headerIndex_(sh,cfg.fields),width=sh.getLastColumn()-1;
  var row=rowNumber?sh.getRange(rowNumber,2,1,width).getValues()[0]:new Array(width).fill('');
  cfg.fields.forEach(function(f){if(Object.prototype.hasOwnProperty.call(entry,f))row[h[f]]=inputToCell_(cfg,f,entry[f]);});
  var target=rowNumber||Math.max(4,sh.getLastRow()+1);sh.getRange(target,2,1,width).setValues([row]);return target;
}
/**
 * Best-effort logical transaction across multiple Sheets. Apps Script has no
 * atomic multi-sheet commit, so snapshot only the modules affected by this
 * operation and compensate on a cross-sheet failure while document lock held.
 * External Drive/Mail/Calendar operations do not run through this pipeline.
 */
const BULK_TRANSACTION_BLOCKLIST=['purchases','orders','transfers','returns','stocktakes','feeReceipts','feeRefunds','orderReceipts','memorials','loans','loanReturns'];
function affectedModules_(key){
  var result=[key];
  var byKey={
    memorials:['slots','memorialHistory'],
    purchases:['stockLedger','purchases'], orders:['stockLedger','orders'],
    transfers:['stockLedger'], returns:['stockLedger'], stocktakes:['stockLedger'],
    purchaseItems:['purchases'], orderItems:['orders'],
    feeReceipts:['fees','finance','feeReceipts'],
    feeRefunds:['fees','finance','feeRefunds'],
    orderReceipts:['orders','finance','orderReceipts'],
    loanReturns:['loans'], loans:['loans'], fees:['fees']
  };
  (byKey[key]||[]).forEach(function(m){if(result.indexOf(m)<0)result.push(m);});
  return result;
}
function snapshotModules_(keys){
  return keys.map(function(k){
    var sh=getSheet_(MODULES[k].sheet),n=Math.max(0,sh.getLastRow()-FIRST_ROW+1),w=Math.max(1,sh.getLastColumn()-FIRST_COL+1);
    return {key:k,name:sh.getName(),width:w,values:n?sh.getRange(FIRST_ROW,FIRST_COL,n,w).getValues():[]};
  });
}
function restoreSnapshots_(snapshots){
  var errors=[];
  snapshots.slice().reverse().forEach(function(s){try{
    var sh=getSheet_(s.name),current=Math.max(0,sh.getLastRow()-FIRST_ROW+1),w=Math.max(s.width,Math.max(1,sh.getLastColumn()-FIRST_COL+1));
    if(current)sh.getRange(FIRST_ROW,FIRST_COL,current,w).clearContent();
    if(s.values.length)sh.getRange(FIRST_ROW,FIRST_COL,s.values.length,s.width).setValues(s.values);
  }catch(e){errors.push(s.name+': '+String(e.message||e));}});
  return errors;
}
function transactionFailure_(err,snapshots){
  var rollback=restoreSnapshots_(snapshots);
  var detail=String(err.message||err);
  throw new Error(rollback.length?'Ghi thất bại; khôi phục dữ liệu chưa hoàn tất ('+rollback.join('; ')+'). Nguyên nhân: '+detail:
    'Thao tác thất bại và đã khôi phục dữ liệu liên quan: '+detail);
}

function saveRecord(key,raw,token){
  var actor=requireSession_(token);authPermission_(actor,key,'write');AUTH_CURRENT_ACTOR=actor;
  if(!MODULES[key]||MODULES[key].readOnly)throw new Error('Phân hệ không cho phép sửa trực tiếp.');
  var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
  try{
    var cfg=MODULES[key],entry={},sheet=getSheet_(cfg.sheet);cfg.fields.forEach(function(f){if(raw&&Object.prototype.hasOwnProperty.call(raw,f))entry[f]=raw[f];});
    var id=String(entry[cfg.id]||'').trim(),existing=rows_(key),old=existing.find(function(r){return String(r[cfg.id])===id;});
    if(id&&!old)throw new Error('Bản ghi cần sửa không còn tồn tại: '+id);
    if(old){entry=Object.assign({},old,entry);(cfg.system||[]).forEach(function(f){entry[f]=old[f];});
      if(key==='users'&&!String(raw['Mật khẩu']||'').trim())entry['Mật khẩu']=old['Mật khẩu'];}
    else {entry[cfg.id]=nextKeys_(key,1,existing)[0];if(key==='users')entry['Ngày tạo']=new Date();}
    if(key==='users'){
      validateAccount_(entry,old);
      if(old&&String(old['Mã tài khoản'])===actor.userId&&
        (entry['Trạng thái']!=='Hoạt động'||normalizeRole_(entry['Vai trò'])!=='Admin'))
        throw new Error('Không thể tự khóa hoặc hạ quyền Admin đang đăng nhập.');
    }
    validateEntry_(key,entry,existing,{});
    precheckPart2_(key,entry,old);
    var snapshot=snapshotModules_(affectedModules_(key)),patches=createChanges_();
    try{
      var rowNo=old?getRowIndex_(sheet,key,id):0;writeRow_(key,entry,rowNo);
      if(key==='memorials'){syncMemorial_(old,entry);pushChange_(patches,'slots');pushChange_(patches,'memorialHistory');}
      postSavePart2_(key,old,entry,patches);
    }catch(e){transactionFailure_(e,snapshot);}
    if(key==='users'&&old&&['Mật khẩu','Vai trò','Trạng thái','Tên đăng nhập','Mã nhân sự','Mã người liên kết'].some(function(f){return String(old[f]||'')!==String(entry[f]||'');}))invalidateAccountSessions_(entry['Mã tài khoản']);
    var outgoing=serializeRow_(key,entry);if(key==='users')delete outgoing['Mật khẩu'];
    auditAuth_(actor,old?'Cập nhật tài khoản':'Thêm tài khoản',entry['Mã tài khoản']);
    return {success:true,key:key,entry:outgoing,created:!old,patches:serializeChanges_(patches)};
  }finally{lock.releaseLock();}
}
/**
 * V8.5: Tạo chứng từ nháp và nhiều dòng chi tiết trong cùng một khóa ghi.
 * Không ghi bút toán kho khi trạng thái Nháp. Chỉ xác nhận ở saveRecord sau khi kiểm tra tồn thực.
 * Bảng cha/con được chụp trước khi ghi, rollback best-effort nếu ghi lỗi.
 */
function createDraftDocument(parentKey,rawHeader,rawLines,requestId,token){
  var map={purchases:{child:'purchaseItems',fk:'Mã phiếu nhập'},orders:{child:'orderItems',fk:'Mã đơn bán'},transfers:{child:'transferItems',fk:'Mã phiếu chuyển'}};
  var spec=map[parentKey];if(!spec)throw new Error('Loại chứng từ không hỗ trợ tạo nhiều dòng.');
  var actor=requireSession_(token);authPermission_(actor,parentKey,'write');authPermission_(actor,spec.child,'write');
  AUTH_CURRENT_ACTOR=actor;
  if(!Array.isArray(rawLines)||rawLines.length<1||rawLines.length>30)throw new Error('Chứng từ cần từ 1 đến 30 dòng chi tiết.');
  if(!rawHeader||typeof rawHeader!=='object')throw new Error('Thiếu thông tin chung.');
  requestId=String(requestId||'');if(requestId&&!/^[A-Za-z0-9_-]{12,100}$/.test(requestId))throw new Error('Mã yêu cầu lưu không hợp lệ.');
  var retryKey=requestId?'v85_doc_'+actor.userId+'_'+requestId:'';
  var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
  try{
    if(retryKey){try{var prev=CacheService.getScriptCache().get(retryKey);if(prev){var refs=JSON.parse(prev),previousParent=rows_(''+parentKey).find(function(r){return String(r[MODULES[parentKey].id])===String(refs.parent);});
      if(previousParent){var prevLines=rows_(spec.child).filter(function(r){return String(r[spec.fk])===String(refs.parent);});return {success:true,reused:true,parent:serializeRow_(parentKey,previousParent),lines:prevLines.map(function(r){return serializeRow_(spec.child,r);}),patches:{}};}
    }}catch(cacheError){}}
    var parentCfg=MODULES[parentKey],childCfg=MODULES[spec.child];
    var header={};parentCfg.fields.forEach(function(f){if(Object.prototype.hasOwnProperty.call(rawHeader,f)&&!(parentCfg.system||[]).includes(f)&&f!==parentCfg.id)header[f]=rawHeader[f];});
    header[parentCfg.id]=nextKeys_(parentKey,1,rows_(parentKey))[0];
    header['Trạng thái']='Nháp'; // Tuyệt đối không tự hạch toán khi tạo chứng từ.
    header['Tổng tiền']=0;
    if(parentKey==='orders'){header['Đã thu']=0;header['Còn nợ']=0;}
    if(parentKey==='purchases'){header['Đã thanh toán']=0;header['Còn nợ']=0;}
    var childOld=rows_(spec.child),usedIds=nextKeys_(spec.child,rawLines.length,childOld),lines=[];
    rawLines.forEach(function(raw,i){
      var obj={};childCfg.fields.forEach(function(f){if(raw&&Object.prototype.hasOwnProperty.call(raw,f)&&!(childCfg.computed||[]).includes(f)&&f!==childCfg.id&&f!==spec.fk)obj[f]=raw[f];});
      obj[childCfg.id]=usedIds[i];obj[spec.fk]=header[parentCfg.id];lines.push(obj);
    });
    var affected=Array.from(new Set([parentKey,spec.child].concat(affectedModules_(spec.child)).concat(affectedModules_(parentKey))));
    var snapshot=snapshotModules_(affected),changes=createChanges_();
    try{
      validateEntry_(parentKey,header,rows_(parentKey),{});
      precheckPart2_(parentKey,header,null);
      writeRow_(parentKey,header,0);
      var cache={};
      lines.forEach(function(line,i){
        validateEntry_(spec.child,line,childOld.concat(lines.slice(0,i)),cache);
        precheckPart2_(spec.child,line,null);
        writeRow_(spec.child,line,0);
        postSavePart2_(spec.child,null,line,changes);
      });
      pushChange_(changes,parentKey);pushChange_(changes,spec.child);
    }catch(err){transactionFailure_(err,snapshot);}
    var latest=rows_(parentKey).find(function(r){return String(r[parentCfg.id])===String(header[parentCfg.id]);})||header;
    if(retryKey)try{CacheService.getScriptCache().put(retryKey,JSON.stringify({parent:header[parentCfg.id]}),21600);}catch(cacheError){}
    return {success:true,parent:serializeRow_(parentKey,latest),lines:lines.map(function(r){return serializeRow_(spec.child,r);}),patches:serializeChanges_(changes)};
  }finally{lock.releaseLock();}
}

function saveBulkRecords(key,items,token){
  var actor=requireSession_(token);authPermission_(actor,key,'write');AUTH_CURRENT_ACTOR=actor;
  if(key==='users')throw new Error('Không được thêm tài khoản hàng loạt.');
  if(BULK_TRANSACTION_BLOCKLIST.indexOf(key)>=0)throw new Error('Phân hệ này có ghi nhận giao dịch kho/quỹ hoặc số dư. Vui lòng lưu từng chứng từ để đồng bộ an toàn.');
  if(!MODULES[key]||!MODULES[key].bulk||MODULES[key].readOnly)throw new Error('Module không hỗ trợ nhập nhiều dòng.');
  if(!Array.isArray(items)||!items.length||items.length>50)throw new Error('Mỗi lượt nhập từ 1 đến 50 dòng.');
  var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
  try{
    var cfg=MODULES[key],all=rows_(key),refs={},ids=nextKeys_(key,items.length,all),clean=[];
    items.forEach(function(item,i){var rec={};cfg.fields.forEach(function(f){if(item&&Object.prototype.hasOwnProperty.call(item,f))rec[f]=item[f];});rec[cfg.id]=ids[i];validateEntry_(key,rec,all.concat(clean),refs);clean.push(rec);});
    var sh=getSheet_(cfg.sheet),hm=headerIndex_(sh,cfg.fields),width=sh.getLastColumn()-1;
    var matrix=clean.map(function(entry){var a=new Array(width).fill('');cfg.fields.forEach(function(f){if(Object.prototype.hasOwnProperty.call(entry,f))a[hm[f]]=inputToCell_(cfg,f,entry[f]);});return a;});
    var snapshot=snapshotModules_(affectedModules_(key)),changes=createChanges_();
    try{sh.getRange(Math.max(4,sh.getLastRow()+1),2,matrix.length,width).setValues(matrix);
      clean.forEach(function(e){postSavePart2_(key,null,e,changes);});
    }catch(err){transactionFailure_(err,snapshot);}
    return {success:true,key:key,rows:clean.map(function(x){return serializeRow_(key,x);}),patches:serializeChanges_(changes)};
  }finally{lock.releaseLock();}
}
function serializeRow_(key,r){var out={},cfg=MODULES[key];cfg.fields.forEach(function(f){out[f]=fmtValue_(r[f],f);});return out;}
function checkLinked_(key,id){
  reverseLinksFor_(key).forEach(function(spec){var p=spec.split(':'),sh=getSheet_(p[0]),last=sh.getLastRow();if(last<4)return;var map=headerIndex_(sh,[p[1]]),col=map[p[1]]+2,vals=sh.getRange(4,col,last-3,1).getDisplayValues();
    if(vals.some(function(r){return String(r[0])===String(id);})){throw new Error('Không thể xóa: mã '+id+' đang được tham chiếu ở tab '+p[0]+' (cột '+p[1]+').');}
  });
}
function deleteRecord(key,id,token){
  var actor=requireSession_(token);authPermission_(actor,key,'delete');AUTH_CURRENT_ACTOR=actor;if(actor.role!=='Admin'&&actor.role!=='Quản lý')throw new Error('Bạn không có quyền xóa.');if(key==='users'&&String(id)===actor.userId)throw new Error('Không được xóa tài khoản đang đăng nhập.');
  if(!MODULES[key]||MODULES[key].readOnly)throw new Error('Không được xóa tại module này.');
  var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
  try{checkLinked_(key,id);var sh=getSheet_(MODULES[key].sheet),row=getRowIndex_(sh,key,id);if(!row)throw new Error('Không tìm thấy dữ liệu cần xóa.');
    var old=rows_(key).find(function(x){return String(x[MODULES[key].id])===String(id);});
    precheckDeletePart2_(key,old);precheckStockDelete_(key,old);
    var snapshot=snapshotModules_(affectedModules_(key)),changes=createChanges_();
    try{sh.deleteRow(row);
      if(key==='memorials'){syncMemorial_({'Mã hồ sơ':id,'Mã vị trí':''},null);pushChange_(changes,'slots');}
      postDeletePart2_(key,old,changes);
    }catch(e){transactionFailure_(e,snapshot);}
    if(key==='users')invalidateAccountSessions_(id);auditAuth_(actor,'Xóa dữ liệu',key+': '+id);return {success:true,key:key,id:id,patches:serializeChanges_(changes)};
  }finally{lock.releaseLock();}
}
function syncMemorial_(oldRow,newRow){
  // Phối hợp vùng vị trí + lịch sử khi thay đổi hồ sơ đã có.
  var oldPos=String(oldRow?.['Mã vị trí']||''),newPos=String(newRow?.['Mã vị trí']||''),id=String(newRow?.['Mã hồ sơ']||oldRow?.['Mã hồ sơ']||'');
  if(oldPos===newPos)return;
  var sh=getSheet_('Vị trí Nhà Linh'),hm=headerIndex_(sh,['Mã vị trí','Mã hồ sơ hiện tại','Trạng thái']),last=sh.getLastRow();
  if(last>=4){var all=sh.getRange(4,2,last-3,sh.getLastColumn()-1).getValues();var changed=false;
    all.forEach(function(row){if(oldPos&&String(row[hm['Mã vị trí']])===oldPos&&String(row[hm['Mã hồ sơ hiện tại']])===id){row[hm['Mã hồ sơ hiện tại']]='';row[hm['Trạng thái']]='Còn trống';changed=true;}
      if(newPos&&String(row[hm['Mã vị trí']])===newPos){row[hm['Mã hồ sơ hiện tại']]=id;row[hm['Trạng thái']]='Đã sử dụng';changed=true;}
    });if(changed)sh.getRange(4,2,all.length,sh.getLastColumn()-1).setValues(all);
  }
  if(oldRow&&newRow){var history=MODULES.memorialHistory,ex=rows_('memorialHistory'),entry={'Mã lịch sử':nextKeys_('memorialHistory',1,ex)[0],'Mã hồ sơ':id,'Ngày thay đổi':new Date(),'Mã vị trí cũ':oldPos,'Mã vị trí mới':newPos,'Nội dung':'Thay đổi vị trí qua Web App','Mã nhân sự thực hiện':''};writeRow_('memorialHistory',entry,0);}
}
function saveCategoryValue(group,value,oldValue,token){
  var actor=requireSession_(token);if(!publicPermissions_(actor).canManageCategories)throw new Error('Không có quyền quản lý danh mục.');
  group=String(group||'').trim();value=String(value||'').trim();oldValue=String(oldValue||'').trim();if(!group||!value)throw new Error('Nhập nhóm và giá trị danh mục.');
  var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
  try{var sh=getSheet_('Danh mục'),hm=headerIndex_(sh,[group]),col=hm[group]+2,last=Math.max(3,sh.getLastRow()),values=last>=4?sh.getRange(4,col,last-3,1).getDisplayValues().map(function(x){return String(x[0]||'').trim();}):[];
    if(values.some(function(v){return v.toLowerCase()===value.toLowerCase()&&v!==oldValue;}))throw new Error('Giá trị đã tồn tại.');
    var i=oldValue?values.indexOf(oldValue):values.indexOf('');if(oldValue&&i<0)throw new Error('Không tìm thấy giá trị cũ.');
    if(oldValue){if(categoryUsed_(group,oldValue))throw new Error('Giá trị danh mục đang được sử dụng, không đổi trực tiếp để tránh sai dữ liệu liên kết.');}
    var target=i<0?Math.max(4,last+1):i+4;sh.getRange(target,col).setValue(value);return {success:true,categories:readCategories_()};
  }finally{lock.releaseLock();}
}
/** Thêm nhiều giá trị vào đúng một cột danh mục, giữ nguyên giá trị đang có. */
function saveCategoryValues(group,items,token){
  var actor=requireSession_(token);
  if(!publicPermissions_(actor).canManageCategories)throw new Error('Không có quyền quản lý danh mục.');
  group=String(group||'').trim();
  if(!Array.isArray(items)||!items.length||items.length>200)throw new Error('Mỗi lần chỉ nhập 1 đến 200 giá trị.');
  var clean=items.map(function(v){return String(v||'').trim();});
  if(clean.some(function(v){return !v||v.length>250;}))throw new Error('Có giá trị trống hoặc dài quá 250 ký tự.');
  var normalized=clean.map(function(v){return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();});
  if(new Set(normalized).size!==clean.length)throw new Error('Danh sách nhập có giá trị trùng.');
  var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
  try{
    var sh=getSheet_('Danh mục'),hm=headerIndex_(sh,[group]),col=hm[group]+2,last=sh.getLastRow();
    var old=last>=FIRST_ROW?sh.getRange(FIRST_ROW,col,last-FIRST_ROW+1,1).getDisplayValues().map(function(r){return String(r[0]||'').trim();}):[];
    var normalize=function(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();};
    var occupied=new Set(old.filter(Boolean).map(normalize));
    if(clean.some(function(v){return occupied.has(normalize(v));}))throw new Error('Một hoặc nhiều giá trị đã tồn tại. Vui lòng Làm mới trước khi thêm.');
    // Chỉ lấp ô trống trong đúng cột được chọn, không ghi đè cột khác.
    var holes=[];old.forEach(function(v,i){if(!v)holes.push(i+FIRST_ROW);});
    var targets=clean.map(function(_,i){return i<holes.length?holes[i]:Math.max(FIRST_ROW,last+1)+i-holes.length;});
    var oldCells=[];
    try{targets.forEach(function(row,i){var cell=sh.getRange(row,col);oldCells.push({row:row,value:cell.getValue()});cell.setValue(/^[=+@]/.test(clean[i])?"'"+clean[i]:clean[i]);});}
    catch(e){oldCells.slice().reverse().forEach(function(x){try{sh.getRange(x.row,col).setValue(x.value);}catch(_){} });throw new Error('Không thể ghi danh mục. Đã cố gắng khôi phục các ô đã ghi: '+e.message);}
    return {success:true,added:clean.length,categories:readCategories_()};
  }finally{lock.releaseLock();}
}

function categoryUsed_(group,value){var used=false;Object.keys(MODULES).forEach(function(k){var cfg=MODULES[k];Object.keys(cfg.cats||{}).forEach(function(f){if(cfg.cats[f]===group&&rows_(k).some(function(r){return String(r[f])===String(value);}))used=true;});});return used;}
function deleteCategoryValue(group,value,token){
  var actor=requireSession_(token);if(!publicPermissions_(actor).canManageCategories)throw new Error('Không có quyền xóa danh mục.');
  var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
  try{if(categoryUsed_(group,value))throw new Error('Giá trị đã được sử dụng trong nghiệp vụ.');
    var sh=getSheet_('Danh mục'),hm=headerIndex_(sh,[group]),col=hm[group]+2,last=sh.getLastRow();if(last<4)throw new Error('Không có dữ liệu danh mục.');
    var vals=sh.getRange(4,col,last-3,1).getDisplayValues(),i=vals.findIndex(function(r){return r[0]===value;});if(i<0)throw new Error('Không tìm thấy lựa chọn cần xóa.');
    sh.getRange(i+4,col).clearContent();return {success:true,categories:readCategories_()};
  }finally{lock.releaseLock();}
}

/* ================= PART 2 - DATA INTEGRITY / LEDGERS ================= */
function reverseLinksFor_(key){
  var all=(REVERSE_REFERENCE[key]||[]).slice();
  Object.keys(MODULES).forEach(function(module){var c=MODULES[module];Object.keys(c.refs||{}).forEach(function(field){
    if(c.refs[field]===key){var tag=c.sheet+':'+field;if(all.indexOf(tag)<0)all.push(tag);}
  });});
  return all;
}
function createChanges_(){return {};}
function pushChange_(changes,key){changes[key]=true;}
function serializeChanges_(changes){
  // Chỉ trả các module liên quan trực tiếp tới giao dịch, không trả toàn bộ bootstrap.
  var out={};Object.keys(changes).forEach(function(k){if(!AUTH_CURRENT_ACTOR||canRead_(AUTH_CURRENT_ACTOR,k))out[k]=scopeResult_(AUTH_CURRENT_ACTOR||{role:'Admin'},k,rows_(k));});return out;
}
function isConfirmed_(s){return ['Đã xác nhận','Hoàn thành','Đã thu','Đã duyệt','Đã hoàn','Đã thanh toán'].indexOf(String(s||''))>=0;}
function isMutableStatus_(s){return !isConfirmed_(s)&&String(s||'')!=='Đã hủy';}
function valueNum_(v){if(typeof v==='number')return v;var s=String(v??'').trim();if(!s)return 0;return normalizeMoney_(s);}
function rowsMatching_(key,field,value){return rows_(key).filter(function(r){return String(r[field])===String(value);});}
function updateExisting_(key,row){var sh=getSheet_(MODULES[key].sheet),index=getRowIndex_(sh,key,row[MODULES[key].id]);if(!index)throw new Error('Không tìm thấy bản ghi '+row[MODULES[key].id]);writeRow_(key,row,index);}
function appendAuto_(key,row){var all=rows_(key);row[MODULES[key].id]=nextKeys_(key,1,all)[0];writeRow_(key,row,0);return row;}
function removeAuto_(key,id){var s=getSheet_(MODULES[key].sheet),idx=getRowIndex_(s,key,id);if(idx)s.deleteRow(idx);}
function moneyValue_(v){return normalizeMoney_(v);}
function requestedMoney_(field,value){var n=moneyValue_(value);if(!isFinite(n)||n<0)throw new Error(field+' cần là số không âm.');return n;}
function positiveQty_(r,f){if(!(valueNum_(r[f])>0))throw new Error(f+' phải lớn hơn 0.');}
function stockBalance_(sku,store,excludeSource){return rows_('stockLedger').filter(function(r){
  return String(r['Mã SKU'])===String(sku)&&String(r['Mã kho'])===String(store) && (!excludeSource||String(r['Mã phiếu nguồn'])!==String(excludeSource));
}).reduce(function(sum,r){return sum+valueNum_(r['Số lượng nhập'])-valueNum_(r['Số lượng xuất']);},0);}
function parentOf_(childKey,parentKey,parentField,rec){var id=rec[parentField],p=rows_(parentKey).find(function(x){return String(x[MODULES[parentKey].id])===String(id);});
  if(!p)throw new Error('Hồ sơ cha không tồn tại: '+id);return p;}
function validatePart2Entry_(key,entry,existing,refCache){
  if(['purchaseItems','orderItems','transferItems','supplyIssues','loanReturns','feeReceipts','orderReceipts','feeRefunds','loans','stocktakes'].indexOf(key)>=0){
    var quantity={purchaseItems:'Số lượng',orderItems:'Số lượng',transferItems:'Số lượng',supplyIssues:'Số lượng',loanReturns:'Số lượng trả',feeReceipts:'Số tiền',orderReceipts:'Số tiền',feeRefunds:'Số tiền hoàn',loans:'Số lượng mượn',stocktakes:'Tồn thực tế'}[key];
    if(key==='stocktakes'){if(valueNum_(entry[quantity])<0)throw new Error('Tồn thực tế không âm.');}else positiveQty_(entry,quantity);
  }
  if(['purchaseItems','orderItems','transferItems'].includes(key)){
    var parentMap={purchaseItems:['purchases','Mã phiếu nhập'],orderItems:['orders','Mã đơn bán'],transferItems:['transfers','Mã phiếu chuyển']},p=parentMap[key],parent=parentOf_(key,p[0],p[1],entry);
    if(!isMutableStatus_(parent['Trạng thái']))throw new Error('Phiếu đã xác nhận/đã hủy. Cần lập điều chỉnh hoặc đưa về Nháp trước khi chỉnh chi tiết.');
    if(key!=='transferItems'){
      var fld=key==='purchaseItems'?'Đơn giá nhập':'Đơn giá bán',price=valueNum_(entry[fld]),sku=(refCache.products||rows_('products')).find(function(x){return String(x['Mã SKU'])===String(entry['Mã SKU']);});
      if(!price&&sku)price=valueNum_(sku[key==='purchaseItems'?'Giá nhập':'Giá bán']);
      if(key==='orderItems'&&sku){
        if(entry['Size']&&sku['Size']&&String(entry['Size'])!==String(sku['Size']))throw new Error('Size trên Chi tiết bán phải trùng Size của SKU đã chọn.');
        entry['Size']=sku['Size']||entry['Size']||'';
      }
      entry[fld]=price;entry['Thành tiền']=valueNum_(entry['Số lượng'])*price;
    }
  }
  if(key==='purchases'||key==='orders'||key==='transfers'){
    if(key==='transfers'&&entry['Mã kho xuất']===entry['Mã kho nhận'])throw new Error('Kho xuất và kho nhận không được trùng.');
    if(entry['Trạng thái']&&isConfirmed_(entry['Trạng thái'])){
      var details={purchases:'purchaseItems',orders:'orderItems',transfers:'transferItems'}[key];
      var fk={purchases:'Mã phiếu nhập',orders:'Mã đơn bán',transfers:'Mã phiếu chuyển'}[key];
      if(!rowsMatching_(details,fk,entry[MODULES[key].id]).length)throw new Error('Cần thêm chi tiết trước khi xác nhận phiếu.');
    }
  }
  if(key==='finance'){
    if(entry['Nguồn phát sinh']&&entry['Nguồn phát sinh']!=='Thủ công')throw new Error('Giao dịch tự phát sinh từ chứng từ nguồn. Chỉ nhập trực tiếp với Nguồn phát sinh = Thủ công.');
    entry['Nguồn phát sinh']='Thủ công';
  }
  if(key==='loans'){
    if(valueNum_(entry['Số lượng đã trả'])>valueNum_(entry['Số lượng mượn']))throw new Error('Đã trả không được vượt quá số mượn.');
  }
  if(key==='loanReturns'){
    var loan=parentOf_(key,'loans','Mã phiếu mượn',entry),prior=rowsMatching_('loanReturns','Mã phiếu mượn',entry['Mã phiếu mượn']).filter(function(x){return String(x['Mã lần trả'])!==String(entry['Mã lần trả']);});
    var total=prior.reduce(function(s,r){return s+valueNum_(r['Số lượng trả']);},valueNum_(entry['Số lượng trả']));
    if(total>valueNum_(loan['Số lượng mượn']))throw new Error('Tổng số lượng trả vượt số lượng đã mượn.');
  }
  if(['feeReceipts','orderReceipts'].includes(key)){
    var isFee=key==='feeReceipts',pKey=isFee?'fees':'orders',fk=isFee?'Mã khoản học phí':'Mã đơn bán',parent=parentOf_(key,pKey,fk,entry),base=isFee?'Phải thu':'Tổng tiền';
    var received=rowsMatching_(key,fk,entry[fk]).filter(function(r){return String(r[MODULES[key].id])!==String(entry[MODULES[key].id])&&isConfirmed_(r['Trạng thái']);}).reduce(function(s,r){return s+valueNum_(r['Số tiền']);},0);
    var other=isConfirmed_(entry['Trạng thái'])?valueNum_(entry['Số tiền']):0;
    if(received+other>valueNum_(parent[base]))throw new Error('Số tiền xác nhận thu vượt tổng tiền phải thu.');
  }
  if(key==='feeRefunds'){
    var fee=parentOf_(key,'fees','Mã khoản học phí',entry);
    var payments=rowsMatching_('feeReceipts','Mã khoản học phí',entry['Mã khoản học phí']).filter(function(x){return isConfirmed_(x['Trạng thái']);}).reduce(function(s,x){return s+valueNum_(x['Số tiền']);},0);
    var otherRefund=rowsMatching_('feeRefunds','Mã khoản học phí',entry['Mã khoản học phí']).filter(function(x){return isConfirmed_(x['Trạng thái'])&&x['Mã hoàn học phí']!==entry['Mã hoàn học phí'];}).reduce(function(s,x){return s+valueNum_(x['Số tiền hoàn']);},0);
    if(isConfirmed_(entry['Trạng thái'])&&otherRefund+valueNum_(entry['Số tiền hoàn'])>payments)throw new Error('Hoàn tiền không được vượt số tiền thực thu.');
    var linked=String(entry['Mã thu học phí']||'');
    if(linked){var selected=rows_('feeReceipts').find(function(x){return x['Mã thu học phí']===linked;});
      if(!selected||selected['Mã khoản học phí']!==entry['Mã khoản học phí'])throw new Error('Mã thu học phí không thuộc khoản học phí này.');
    } else if(isConfirmed_(entry['Trạng thái'])){
      var funds=Array.from(new Set(rowsMatching_('feeReceipts','Mã khoản học phí',entry['Mã khoản học phí']).filter(function(x){return isConfirmed_(x['Trạng thái']);}).map(function(x){return x['Mã quỹ'];})));
      if(funds.length>1)throw new Error('Khoản học phí thu vào nhiều quỹ; cần chọn Mã thu học phí để xác định quỹ hoàn trả.');
    }

  }
  if(key==='stocktakes'){
    var existingQty=stockBalance_(entry['Mã SKU'],entry['Mã kho'],entry['Mã kiểm kê']);
    entry['Tồn hệ thống']=existingQty;entry['Chênh lệch']=valueNum_(entry['Tồn thực tế'])-existingQty;
  }
  if(key==='returns'){
    if(valueNum_(entry['Số lượng trả'])<=0)throw new Error('Số lượng trả phải lớn hơn 0.');
    var sold=rowsMatching_('orderItems','Mã đơn bán',entry['Mã đơn bán']).filter(function(x){return x['Mã SKU']===entry['Mã SKU trả'];})
      .reduce(function(v,x){return v+valueNum_(x['Số lượng']);},0);
    var returned=rowsMatching_('returns','Mã đơn bán',entry['Mã đơn bán']).filter(function(x){return x['Mã SKU trả']===entry['Mã SKU trả']&&x['Mã đổi trả']!==entry['Mã đổi trả']&&isConfirmed_(x['Trạng thái']);})
      .reduce(function(v,x){return v+valueNum_(x['Số lượng trả']);},0);
    if(isConfirmed_(entry['Trạng thái'])&&returned+valueNum_(entry['Số lượng trả'])>sold)throw new Error('Số lượng trả vượt số lượng đã bán của SKU này.');
    if(isConfirmed_(entry['Trạng thái'])&&!entry['Tình trạng hàng'])throw new Error('Chọn tình trạng hàng trả trước khi xác nhận.');
  }
  if(key==='orders'&&valueNum_(entry['Đã thu'])<0)throw new Error('Đã thu phải không âm.');
  if(key==='purchases'&&valueNum_(entry['Đã thanh toán'])<0)throw new Error('Đã thanh toán phải không âm.');
}
/** Check projected stock on post / edit / cancellation / delete. */
function assertStockProjected_(key,entry){
  var source=entry[MODULES[key].id],actual=rowsMatching_('stockLedger','Mã phiếu nguồn',source),desired=desiredStockMovements_(key,entry),impacted={};
  function add(store,sku,quantity){if(!store||!sku)return;var k=store+'|'+sku;impacted[k]=(impacted[k]||0)+quantity;}
  actual.forEach(function(r){add(r['Mã kho'],r['Mã SKU'],-valueNum_(r['Số lượng nhập'])+valueNum_(r['Số lượng xuất']));});
  desired.forEach(function(r){add(r.store,r.sku,r.inQty-r.outQty);});
  Object.keys(impacted).forEach(function(k){var p=k.split('|'),balance=stockBalance_(p[1],p[0]);
    if(balance+impacted[k]<-0.00001)throw new Error('Tồn kho không đủ tại '+p[0]+' / '+p[1]+'. Tồn hiện tại '+balance+', thay đổi '+impacted[k]+'.');
  });
}
function precheckStockDelete_(key,old){
  if(!old||!['purchases','orders','transfers','returns','stocktakes'].includes(key))return;
  var row={};row[MODULES[key].id]=old[MODULES[key].id];row['Trạng thái']='Đã hủy';assertStockProjected_(key,row);
}
function precheckPart2_(key,entry,old){
  if(key==='fees'){
    var net=rowsMatching_('feeReceipts','Mã khoản học phí',entry['Mã khoản học phí']).filter(function(x){return isConfirmed_(x['Trạng thái']);})
      .reduce(function(v,r){return v+valueNum_(r['Số tiền']);},0) - rowsMatching_('feeRefunds','Mã khoản học phí',entry['Mã khoản học phí'])
      .filter(function(x){return isConfirmed_(x['Trạng thái']);}).reduce(function(v,r){return v+valueNum_(r['Số tiền hoàn']);},0);
    if(net>valueNum_(entry['Phải thu']))throw new Error('Phải thu mới nhỏ hơn số đã thu. Cần hoàn tiền trước.');
  }

  if(['purchases','orders','transfers','returns','stocktakes'].includes(key))assertStockProjected_(key,entry);
  if(key==='returns'&&isConfirmed_(entry['Trạng thái'])){
    var parent=parentOf_(key,'orders','Mã đơn bán',entry),store=parent['Mã kho'];
    if(entry['Mã SKU đổi']&&valueNum_(entry['Số lượng đổi'])>0&&stockBalance_(entry['Mã SKU đổi'],store,entry['Mã đổi trả'])<valueNum_(entry['Số lượng đổi']))throw new Error('SKU đổi không đủ tồn kho.');
  }
}
function precheckDeletePart2_(key,row){
  if(!row)return;
  if(['feeReceipts','feeRefunds','orderReceipts'].includes(key)&&isConfirmed_(row['Trạng thái']))throw new Error('Chứng từ đã hạch toán không được xóa trực tiếp. Hãy xử lý điều chỉnh ở chứng từ nguồn.');
  if(['purchases','orders','transfers'].includes(key)&&isConfirmed_(row['Trạng thái']))throw new Error('Phiếu đã xác nhận không được xóa. Hãy chuyển về trạng thái hủy nếu được phép và không làm âm tồn.');
  if(['purchaseItems','orderItems','transferItems'].includes(key)){
    var p={purchaseItems:['purchases','Mã phiếu nhập'],orderItems:['orders','Mã đơn bán'],transferItems:['transfers','Mã phiếu chuyển']}[key],parent=parentOf_(key,p[0],p[1],row);
    if(!isMutableStatus_(parent['Trạng thái']))throw new Error('Không thể xóa chi tiết của phiếu đã xác nhận.');
  }
  if(key==='finance'&&row['Nguồn phát sinh']!=='Thủ công')throw new Error('Giao dịch phát sinh tự động chỉ được sửa qua chứng từ nguồn.');
}
function desiredStockMovements_(key,row){
  var out=[],source=row[MODULES[key].id];
  function add(store,sku,inc,dec,kind){out.push({store:store,sku:sku,inQty:inc,outQty:dec,kind:kind});}
  if(['purchases','orders','transfers'].includes(key)){
    if(!isConfirmed_(row['Trạng thái']))return [];
    var child={purchases:['purchaseItems','Mã phiếu nhập'],orders:['orderItems','Mã đơn bán'],transfers:['transferItems','Mã phiếu chuyển']}[key];
    rowsMatching_(child[0],child[1],source).forEach(function(line){var sku=line['Mã SKU'],q=valueNum_(line['Số lượng']);
      if(key==='purchases')add(row['Mã kho'],sku,q,0,'Nhập kho');
      if(key==='orders')add(row['Mã kho'],sku,0,q,'Bán hàng');
      if(key==='transfers'){add(row['Mã kho xuất'],sku,0,q,'Điều chuyển xuất');add(row['Mã kho nhận'],sku,q,0,'Điều chuyển nhập');}
    });
  }
  if(key==='returns'&&isConfirmed_(row['Trạng thái'])){
    var ord=rows_('orders').find(function(r){return r['Mã đơn bán']===row['Mã đơn bán'];});if(!ord)return out;
    if(row['Tình trạng hàng']!=='Hư hỏng'&&row['Tình trạng hàng']!=='Không thể bán')add(ord['Mã kho'],row['Mã SKU trả'],valueNum_(row['Số lượng trả']),0,'Đổi trả nhập');
    if(row['Mã SKU đổi']&&valueNum_(row['Số lượng đổi'])>0)add(ord['Mã kho'],row['Mã SKU đổi'],0,valueNum_(row['Số lượng đổi']),'Đổi trả xuất');
  }
  if(key==='stocktakes'&&isConfirmed_(row['Trạng thái'])){
    var diff=valueNum_(row['Chênh lệch']);if(diff)add(row['Mã kho'],row['Mã SKU'],Math.max(0,diff),Math.max(0,-diff),'Điều chỉnh kiểm kê');
  }
  return out;
}
function syncStockLedger_(key,entry,changes){
  var source=entry[MODULES[key].id],existing=rowsMatching_('stockLedger','Mã phiếu nguồn',source);
  var desired=desiredStockMovements_(key,entry);
  // Chỉ viết lại bút toán nguồn hiện tại. Sổ kho không được CRUD thủ công.
  existing.forEach(function(x){removeAuto_('stockLedger',x['Mã giao dịch kho']);});
  desired.forEach(function(m){appendAuto_('stockLedger',{
    'Ngày giao dịch':new Date(),'Loại giao dịch':m.kind,'Mã phiếu nguồn':source,'Mã kho':m.store,
    'Mã SKU':m.sku,'Số lượng nhập':m.inQty,'Số lượng xuất':m.outQty,'Mã nhân sự thực hiện':'','Trạng thái':'Hoàn thành'
  });});
  pushChange_(changes,'stockLedger');
}
function syncFinanceLedger_(key,entry,changes){
  var cfg=MODULES[key],source=entry[cfg.id],existing=rows_('finance').filter(function(r){return r['Mã chứng từ nguồn']===source&&r['Nguồn phát sinh']===cfg.title;});
  var isReceipt=['feeReceipts','orderReceipts'].includes(key),valid=isConfirmed_(entry['Trạng thái']);
  var amount=isReceipt?valueNum_(entry['Số tiền']):key==='feeRefunds'?valueNum_(entry['Số tiền hoàn']):0;
  var fund=entry['Mã quỹ']||'';
  if(key==='feeRefunds'){
    var receipt=rowsMatching_('feeReceipts','Mã khoản học phí',entry['Mã khoản học phí']).find(function(x){return isConfirmed_(x['Trạng thái'])&&(!entry['Mã thu học phí']||x['Mã thu học phí']===entry['Mã thu học phí']);});fund=receipt?.['Mã quỹ']||'';
  }
  if(!fund||!amount)valid=false;
  if(!valid){existing.forEach(function(r){removeAuto_('finance',r['Mã giao dịch']);});if(entry['Mã giao dịch tài chính']){entry['Mã giao dịch tài chính']='';if(getRowIndex_(getSheet_(cfg.sheet),key,source))updateExisting_(key,entry);}}
  else{
    var r={'Ngày giao dịch':entry['Ngày thu']||entry['Ngày đề nghị']||new Date(),'Loại giao dịch':key==='feeRefunds'?'Chi':'Thu',
      'Nhóm thu chi':key==='feeRefunds'?'Hoàn học phí':key==='feeReceipts'?'Học phí':'Bán hàng','Nguồn phát sinh':cfg.title,
      'Mã chứng từ nguồn':source,'Mã quỹ':fund,'Số tiền':amount,'Phương thức':entry['Phương thức']||'Tiền mặt',
      'Đối tượng':entry['Mã khoản học phí']||entry['Mã đơn bán']||'','Mã nhân sự thực hiện':entry['Mã nhân sự thu']||'',
      'Trạng thái':'Đã xác nhận','Nội dung':'Đồng bộ từ '+cfg.title};
    if(existing.length){r['Mã giao dịch']=existing[0]['Mã giao dịch'];updateExisting_('finance',r);existing.slice(1).forEach(function(x){removeAuto_('finance',x['Mã giao dịch']);});}
    else r=appendAuto_('finance',r);
    entry['Mã giao dịch tài chính']=r['Mã giao dịch'];updateExisting_(key,entry);
  }
  pushChange_(changes,'finance');
}
function recomputeParent_(key,parentKey,reference,sourceId,changes){
  var row=rows_(parentKey).find(function(r){return String(r[MODULES[parentKey].id])===String(sourceId);});if(!row)return;
  if(parentKey==='fees'){
    var receipts=rowsMatching_('feeReceipts','Mã khoản học phí',sourceId).filter(function(x){return isConfirmed_(x['Trạng thái']);});
    var refunds=rowsMatching_('feeRefunds','Mã khoản học phí',sourceId).filter(function(x){return isConfirmed_(x['Trạng thái']);});
    var paid=receipts.reduce(function(s,x){return s+valueNum_(x['Số tiền']);},0)-refunds.reduce(function(s,x){return s+valueNum_(x['Số tiền hoàn']);},0);
    var due=valueNum_(row['Phải thu']);row['Trạng thái']=paid>=due&&due>0?'Đã thu':paid>0?'Thu một phần':'Chưa thu';
  }
  if(parentKey==='orders'){
    var lines=rowsMatching_('orderItems','Mã đơn bán',sourceId),total=lines.reduce(function(s,x){return s+valueNum_(x['Thành tiền']);},0);
    var receipts=rowsMatching_('orderReceipts','Mã đơn bán',sourceId).filter(function(r){return isConfirmed_(r['Trạng thái']);});
    row['Tổng tiền']=total;row['Đã thu']=receipts.reduce(function(s,x){return s+valueNum_(x['Số tiền']);},0);row['Còn nợ']=Math.max(0,total-row['Đã thu']);
  }
  if(parentKey==='purchases'){
    var lines=rowsMatching_('purchaseItems','Mã phiếu nhập',sourceId),total=lines.reduce(function(s,x){return s+valueNum_(x['Thành tiền']);},0);
    row['Tổng tiền']=total;row['Còn nợ']=Math.max(0,total-valueNum_(row['Đã thanh toán']));
  }
  if(parentKey==='loans'){
    var returned=rowsMatching_('loanReturns','Mã phiếu mượn',sourceId).reduce(function(s,r){return s+valueNum_(r['Số lượng trả']);},0);
    row['Số lượng đã trả']=returned;row['Trạng thái']=returned>=valueNum_(row['Số lượng mượn'])?'Đã trả đủ':returned?'Trả một phần':'Đang mượn';
  }
  updateExisting_(parentKey,row);pushChange_(changes,parentKey);
}
function postSavePart2_(key,old,entry,changes){
  var parent={purchaseItems:['purchases','Mã phiếu nhập'],orderItems:['orders','Mã đơn bán'],feeReceipts:['fees','Mã khoản học phí'],feeRefunds:['fees','Mã khoản học phí'],orderReceipts:['orders','Mã đơn bán'],loanReturns:['loans','Mã phiếu mượn']}[key];
  if(parent)recomputeParent_(key,parent[0],parent[1],entry[parent[1]],changes);
  if(['purchases','orders','transfers','returns','stocktakes'].includes(key))syncStockLedger_(key,entry,changes);
  if(['feeReceipts','orderReceipts','feeRefunds'].includes(key))syncFinanceLedger_(key,entry,changes);
  if(key==='purchases'||key==='orders'||key==='fees')recomputeParent_(key,key,'',entry[MODULES[key].id],changes);
  if(key==='loans')recomputeParent_('loans','loans','',entry['Mã phiếu mượn'],changes);
  if(['feeReceipts','feeRefunds','orderReceipts'].includes(key))pushChange_(changes,key);
  auditPart2_(key,old?'Sửa':'Thêm',old,entry);
}
function postDeletePart2_(key,old,changes){
  if(!old)return;
  var parent={purchaseItems:['purchases','Mã phiếu nhập'],orderItems:['orders','Mã đơn bán'],feeReceipts:['fees','Mã khoản học phí'],feeRefunds:['fees','Mã khoản học phí'],orderReceipts:['orders','Mã đơn bán'],loanReturns:['loans','Mã phiếu mượn']}[key];
  if(parent)recomputeParent_(key,parent[0],parent[1],old[parent[1]],changes);
  if(['purchases','orders','transfers','returns','stocktakes'].includes(key)){var entity={'Trạng thái':'Đã hủy'};entity[MODULES[key].id]=old[MODULES[key].id];syncStockLedger_(key,entity,changes);}
  if(['feeReceipts','feeRefunds','orderReceipts'].includes(key)){var entity={'Trạng thái':'Đã hủy'};entity[MODULES[key].id]=old[MODULES[key].id];syncFinanceLedger_(key,entity,changes);}
  auditPart2_(key,'Xóa',old,null);
}
var AUTH_CURRENT_ACTOR=null;
function auditPart2_(module,action,before,after){
  // Log không chứa mật khẩu hoặc thông tin đăng nhập; Part 3 mới xác định actor.
  try{appendAuto_('audit',{'Thời gian':new Date(),'Mã tài khoản':AUTH_CURRENT_ACTOR?.userId||'','Phân hệ':MODULES[module].sheet,'Hành động':action,
    'Mã bản ghi':after?.[MODULES[module].id]||before?.[MODULES[module].id]||'',
    'Dữ liệu trước':before?JSON.stringify(module==='users'?Object.assign({},before,{'Mật khẩu':'[Ẩn]'}):before).slice(0,5000):'','Dữ liệu sau':after?JSON.stringify(module==='users'?Object.assign({},after,{'Mật khẩu':'[Ẩn]'}):after).slice(0,5000):'','Kết quả':'Thành công'});}catch(err){console.warn('Audit:',err);}
}

/* ================= PART 2 - DRIVE, PREVIEW, IMPORT, REPORTS ================= */
const UPLOAD_FOLDER_PROP='CHUA_V8_UPLOAD_FOLDER_ID';
const UPLOAD_FOLDER_LABEL='CHUA V8 - TAI LIEU DINH KEM';
const ALLOWED_FILE_TYPES=/^(image\/(jpeg|png|webp|gif)|application\/pdf|text\/plain|text\/csv|application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet)|application\/msword|application\/vnd\.ms-excel)$/i;
function validateFileRecord_(module,id){
  if(!MODULES[module]||['files','emails','audit','stockLedger'].includes(module))throw new Error('Phân hệ đính kèm không hợp lệ.');
  if(!rows_(module).some(function(x){return String(x[MODULES[module].id])===String(id);}))throw new Error('Chưa có bản ghi liên kết. Hãy lưu hồ sơ trước khi tải file.');
}
function getUploadFolder_(module){
  var p=PropertiesService.getScriptProperties(),id=p.getProperty(UPLOAD_FOLDER_PROP),root=null;
  if(id){try{root=DriveApp.getFolderById(id);}catch(e){root=null;}}
  if(!root){root=DriveApp.createFolder(UPLOAD_FOLDER_LABEL);p.setProperty(UPLOAD_FOLDER_PROP,root.getId());}
  var name=MODULES[module].sheet,found=root.getFoldersByName(name);return found.hasNext()?found.next():root.createFolder(name);
}
function saveUploadedFile(payload,token){
  var actor=requireSession_(token);if(!payload||!canWrite_(actor,payload.module,'write'))throw new Error('Không có quyền upload vào phân hệ này.');
  payload=payload||{};var module=String(payload.module||''),recordId=String(payload.recordId||'');validateFileRecord_(module,recordId);
  var fname=String(payload.fileName||'').replace(/[\\/\r\n\x00-\x1f]/g,'_').trim().slice(0,175),mime=String(payload.mimeType||'').trim().toLowerCase();
  if(!fname||!ALLOWED_FILE_TYPES.test(mime))throw new Error('Loại file không hỗ trợ (ảnh, PDF, Word, Excel, CSV hoặc TXT).');
  var mat=String(payload.dataUrl||'').match(/^data:([^;]+);base64,(.+)$/);if(!mat||mat[1].toLowerCase()!==mime)throw new Error('Dữ liệu tải lên không hợp lệ.');
  if(mat[2].length>18*1024*1024)throw new Error('Giới hạn tải lên tối đa 12 MB mỗi file.');
  var bytes=Utilities.base64Decode(mat[2]);if(bytes.length>12*1024*1024)throw new Error('File vượt quá 12 MB.');
  var blob=Utilities.newBlob(bytes,mime,fname),folder=getUploadFolder_(module),file=folder.createFile(blob);
  var row={'Ngày tải lên':new Date(),'Phân hệ':MODULES[module].sheet,'Mã bản ghi liên kết':recordId,
    'Loại tài liệu':String(payload.documentType||'Tài liệu khác'),'Tên file':fname,'MIME type':mime,'Dung lượng KB':Math.round(bytes.length/1024),
    'File ID':file.getId(),'Link xem':file.getUrl(),'Link tải':'https://drive.google.com/uc?export=download&id='+file.getId(),'Mã người tải':actor.employeeId||actor.userId,'Trạng thái':'Hoạt động'};
  try{
    var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
    try{row=appendAuto_('files',row);var main=MODULES[module],field=main.fields.includes('Ảnh File ID')?'Ảnh File ID':'';
      if(field&&mime.indexOf('image/')===0&&String(payload.documentType||'').indexOf('Ảnh')===0){var parent=rows_(module).find(function(x){return String(x[main.id])===recordId;});if(parent){parent[field]=file.getId();updateExisting_(module,parent);}}
    }finally{lock.releaseLock();}
  }catch(e){file.setTrashed(true);throw e;}
  return {success:true,file:serializeRow_('files',row),linked:rows_(module).find(function(x){return String(x[MODULES[module].id])===recordId;})||null};
}
function getUploadedFilePreview(id,token){
  var actor=requireSession_(token);
  var meta=rows_('files').find(function(x){return String(x['Mã tài liệu'])===String(id);});
  if(!meta||meta['Trạng thái']==='Đã xóa')throw new Error('Tài liệu không tồn tại.');
  if(!canRead_(actor,'files'))throw new Error('Không có quyền xem tài liệu.');
  var related=Object.keys(MODULES).find(function(k){return MODULES[k].sheet===meta['Phân hệ'];});
  if(!related||!canRead_(actor,related))throw new Error('Không có quyền truy cập hồ sơ gắn với file.');
  var type=String(meta['MIME type']||'').toLowerCase(),f;
  try{f=DriveApp.getFileById(meta['File ID']);}catch(e){throw new Error('Không đọc được file trên Drive. Kiểm tra quyền truy cập hoặc file đã bị xóa.');}
  if(f.getSize()>7*1024*1024)return {kind:'external',file:meta,note:'File lớn, vui lòng mở trên Google Drive để xem.'};
  if(type.indexOf('image/')===0||type==='application/pdf')return {kind:type==='application/pdf'?'pdf':'image',dataUrl:'data:'+type+';base64,'+Utilities.base64Encode(f.getBlob().getBytes()),file:meta};
  if(type==='text/plain'||type==='text/csv')return {kind:'text',text:f.getBlob().getDataAsString('UTF-8').slice(0,200000),file:meta};
  return {kind:'external',file:meta,note:'Định dạng này phù hợp mở bằng Google Drive hoặc tải xuống.'};
}
function deleteUploadedFile(id,token){
  var actor=requireSession_(token);if(actor.role!=='Admin')throw new Error('Chỉ Admin được xóa file Drive.');
  var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
  try{var row=rows_('files').find(function(x){return x['Mã tài liệu']===id;});if(!row)throw new Error('File đã được xóa hoặc không tồn tại.');
    if(row['File ID']){try{DriveApp.getFileById(row['File ID']).setTrashed(true);}catch(e){throw new Error('Không thể chuyển file vào thùng rác Drive: '+e.message);}}
    row['Trạng thái']='Đã xóa';updateExisting_('files',row);
    var module=Object.keys(MODULES).find(function(k){return MODULES[k].sheet===row['Phân hệ'];}),linked=null;
    if(module&&MODULES[module].fields.includes('Ảnh File ID')){linked=rows_(module).find(function(x){return x[MODULES[module].id]===row['Mã bản ghi liên kết'];});if(linked&&linked['Ảnh File ID']===row['File ID']){linked['Ảnh File ID']='';updateExisting_(module,linked);}}
    return {success:true,file:row,module:module,linked:linked};
  }finally{lock.releaseLock();}
}
function importModuleRows(key,rows,token){
  var actor=requireSession_(token);authPermission_(actor,key,'write');AUTH_CURRENT_ACTOR=actor;if(key==='users')throw new Error('Không cho Import hàng loạt tài khoản.');
  if(BULK_TRANSACTION_BLOCKLIST.indexOf(key)>=0)throw new Error('Phân hệ ghi nhận giao dịch kho/quỹ cần nhập từng chứng từ.');
  if(!MODULES[key]||MODULES[key].readOnly)throw new Error('Không cho phép nhập module này.');
  if(!Array.isArray(rows)||!rows.length||rows.length>150)throw new Error('Chọn từ 1 đến 150 dòng hợp lệ.');
  var cfg=MODULES[key],lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
  try{
    var existing=rows_(key),ids=nextKeys_(key,rows.length,existing),clean=[],refCache={};
    rows.forEach(function(raw,i){var r={};cfg.fields.forEach(function(f){if(![cfg.id].concat(cfg.computed||[],cfg.system||[]).includes(f)&&Object.prototype.hasOwnProperty.call(raw,f))r[f]=raw[f];});
      r[cfg.id]=ids[i];validateEntry_(key,r,existing.concat(clean),refCache);precheckPart2_(key,r,null);clean.push(r);
    });
    var sh=getSheet_(cfg.sheet),hm=headerIndex_(sh,cfg.fields),width=sh.getLastColumn()-1;
    var matrix=clean.map(function(r){var line=new Array(width).fill('');cfg.fields.forEach(function(f){line[hm[f]]=inputToCell_(cfg,f,r[f]);});return line;});
    var snapshot=snapshotModules_(affectedModules_(key)),changes=createChanges_();
    try{sh.getRange(Math.max(4,sh.getLastRow()+1),2,matrix.length,width).setValues(matrix);
      clean.forEach(function(r){postSavePart2_(key,null,r,changes);});
    }catch(err){transactionFailure_(err,snapshot);}
    return {success:true,key:key,rows:clean.map(function(r){return serializeRow_(key,r);}),patches:serializeChanges_(changes)};
  }finally{lock.releaseLock();}
}
function getAggregatedReport(token){
  var actor=requireSession_(token);if(!publicPermissions_(actor).canReport)throw new Error('Không có quyền xem báo cáo tài chính.');
  // Không đọc Drive. Tính các báo cáo nặng trên demand, chỉ khi người dùng yêu cầu.
  var finance=rows_('finance').filter(function(x){return x['Trạng thái']==='Đã xác nhận'||x['Trạng thái']==='Hoàn thành';}),stock=rows_('stockLedger');
  var totals={},monthly={};finance.forEach(function(r){var group=r['Mã quỹ']||'Chưa phân quỹ',mult=r['Loại giao dịch']==='Chi'?-1:1;
    totals[group]=(totals[group]||0)+mult*valueNum_(r['Số tiền']);var date=String(r['Ngày giao dịch']||'').slice(3,10);monthly[date]=(monthly[date]||0)+mult*valueNum_(r['Số tiền']);});
  var stockTotals={};stock.forEach(function(r){var k=r['Mã kho']+'|'+r['Mã SKU'];stockTotals[k]=(stockTotals[k]||0)+valueNum_(r['Số lượng nhập'])-valueNum_(r['Số lượng xuất']);});
  return {fundBalances:totals,monthly:monthly,inventory:stockTotals,generatedAt:new Date().toISOString()};
}
/* ================= V8.8 EMAIL TỔNG HỢP - KHÔNG GOOGLE CALENDAR =================
 * Trigger độc lập; KHÔNG chạy từ doGet, bootstrap, CRUD, refresh hay login.
 * Email HTML inline, plain-text fallback, khóa và nhật ký trước MailApp.sendEmail.
 * Một email / địa chỉ / ngày. Đã gửi hoặc chưa rõ kết quả tuyệt đối không tự gửi lại.
 */
const REMINDER_EMAIL_TZ='Asia/Ho_Chi_Minh';
const REMINDER_EMAIL_GROUP='Tổng hợp nhắc việc';
function reminderDayNumber_(value){
  var d=parseDate_(value);if(!d)return null;
  return Math.round(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000);
}
function reminderValidEmail_(value){
  var s=String(value||'').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)&&!/example\.(com|org|net)$/.test(s)&&s.length<=254;
}
function reminderEscape_(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function reminderKey_(day,addr){
  var value='CHUA-V8.8|'+day+'|'+String(addr).trim().toLowerCase()+'|'+REMINDER_EMAIL_GROUP;
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,value)).replace(/=+$/,'').slice(0,38);
}
function reminderActive_(v){var s=String(v||'').trim();return !['Hoàn thành','Đã hủy','Đã thu','Đã hoàn tất','Đã trả xe','Kết thúc','Tạm dừng'].includes(s);}
function reminderRecipients_(){
  var people=rows_('employees'),accounts=rows_('users'),recipients=new Map(),byId={};
  people.forEach(function(x){byId[String(x['Mã nhân sự']||'')]=x;});
  var restrictedIds=new Set(),authorizedIds=new Set();
  accounts.forEach(function(x){if(String(x['Trạng thái'])!=='Hoạt động')return;
    var id=String(x['Mã nhân sự']||'');if(!id)return;
    if(['Viewer','Phụ huynh'].includes(normalizeRole_(x['Vai trò'])))restrictedIds.add(id);
    else if(['Admin','Quản lý','Nhân sự'].includes(normalizeRole_(x['Vai trò'])))authorizedIds.add(id);
  });
  accounts.forEach(function(x){if(String(x['Trạng thái'])!=='Hoạt động')return;
    var id=String(x['Mã nhân sự']||'');if(!id||!byId[id])return;
    var employee=byId[id],email=String(employee.Email||'').trim().toLowerCase();if(!reminderValidEmail_(email))return;
    if(['Đã nghỉ','Tạm nghỉ','Ngừng hoạt động','Tạm ngừng'].includes(String(employee['Trạng thái']||'')))return;
    var role=normalizeRole_(x['Vai trò']);if(!['Admin','Quản lý','Nhân sự'].includes(role))return;
    var item=recipients.get(email)||{email:email,ids:new Set(),role:'Nhân sự',name:employee['Họ tên']||email};
    item.ids.add(id);if(role==='Admin'||(role==='Quản lý'&&item.role!=='Admin'))item.role=role;
    recipients.set(email,item);
  });
  // Chỉ nhận email của tài khoản đang hoạt động có vai trò được phép.
  // Không tự ý gửi tới toàn bộ danh bạ nhân sự không có tài khoản.
  return Array.from(recipients.values()).sort(function(a,b){return a.email.localeCompare(b.email);});
}
function reminderBuildItems_(rec,todayNumber,data,config){
  config=config||reminderConfig_();
  var supervisor=rec.role==='Admin'||rec.role==='Quản lý',items=[],issues=[];
  function allowed(id){return supervisor||rec.ids.has(String(id||''));}
  function add(section,id,title,due,owner,state,priority,force){
    var scopes={'Công việc':'tasks','Sự kiện':'events','Tiếp nhận':'intakes','Bảo dưỡng':'maintenance','Bảo hành':'warranty','Học phí':'fees'};
    if(config.scopes.indexOf(scopes[section])<0||!reminderActive_(state))return;
    if(!allowed(owner)&&!(supervisor&&!owner))return;
    var day=reminderDayNumber_(due),diff=day===null?null:day-todayNumber;
    var bucket=diff===null?null:diff<0?'late':diff===0?'today':diff<=config.daysAhead?'soon':null;
    if(force==='approval'&&bucket===null)bucket='approval';
    if(!bucket)return;
    items.push({section:section,id:String(id||''),title:String(title||id||'Không có tiêu đề'),due:String(due||''),owner:String(owner||''),state:String(state||''),priority:String(priority||''),bucket:bucket,remaining:diff});
  }
  (data.tasks||[]).forEach(function(t){add('Công việc',t['Mã công việc'],t['Tiêu đề'],t['Ngày hạn'],t['Mã nhân sự phụ trách'],t['Trạng thái'],t['Mức ưu tiên'],t['Trạng thái']==='Chờ xác nhận'?'approval':'');});
  (data.events||[]).forEach(function(t){add('Sự kiện',t['Mã sự kiện'],t['Tên sự kiện'],t['Ngày dương lịch'],t['Mã nhân sự phụ trách'],t['Trạng thái'],'','');});
  (data.intakes||[]).forEach(function(t){add('Tiếp nhận',t['Mã tiếp nhận'],t['Nội dung']||t['Loại yêu cầu'],t['Ngày mong muốn'],t['Mã nhân sự xử lý'],t['Trạng thái'],'','');});
  var assetById={};(data.assets||[]).forEach(function(a){assetById[String(a['Mã tài sản']||'')]=a;});
  (data.maintenance||[]).forEach(function(t){
    var asset=assetById[String(t['Mã tài sản']||'')]||{},due=t['Ngày dự kiến tiếp theo'];
    if(due) add('Bảo dưỡng',t['Mã bảo dưỡng'],'Bảo dưỡng '+(asset['Tên tài sản']||t['Mã tài sản']||''),due,asset['Mã nhân sự quản lý'],'Đến kỳ bảo dưỡng','','');
  });
  if(supervisor)(data.fees||[]).forEach(function(t){add('Học phí',t['Mã khoản học phí'],'Khoản học phí '+(t['Kỳ học phí']||''),t['Ngày đến hạn'],'',t['Trạng thái'],'','');});
  var ownerMap={};(data.employees||[]).forEach(function(x){ownerMap[x['Mã nhân sự']]=x['Họ tên'];});
  (data.assets||[]).forEach(function(t){
    if(['Thanh lý','Ngừng sử dụng','Đã hủy'].includes(String(t['Trạng thái']||'')))return;
    add('Bảo hành',t['Mã tài sản'],'Hết bảo hành: '+t['Tên tài sản'],t['Ngày hết bảo hành'],t['Mã nhân sự quản lý'],'Đang bảo hành','','');
  });
  var order={late:0,today:1,approval:2,soon:3};
  items.sort(function(a,b){return (order[a.bucket]-order[b.bucket])||(a.remaining||0)-(b.remaining||0)||a.id.localeCompare(b.id);});
  if(!supervisor)items=items.filter(function(x){return x.owner&&rec.ids.has(x.owner);});
  var summary={late:0,today:0,soon:0,approval:0};items.forEach(function(x){summary[x.bucket]++;x.ownerName=ownerMap[x.owner]||x.owner||'Chưa phân công';});
  return {items:items,summary:summary,supervisor:supervisor};
}
function reminderEmailContent_(recipient,built,dateLabel){
  var all=built.items,summary=built.summary,headline='[Hoạt động chùa] Tổng hợp nhắc việc ngày '+dateLabel;
  var colors={late:'#a42c2c',today:'#a36a15',soon:'#3b8067',approval:'#815c91'};
  var sections=[{bucket:'late',title:'Công việc và hồ sơ quá hạn'},
    {bucket:'today',title:'Đến hạn hôm nay'},
    {bucket:'approval',title:'Chờ xác nhận'},
    {bucket:'soon',title:'Sắp đến hạn'}];
  var html=['<div style="font-family:Arial,Helvetica,sans-serif;background:#f7f1e6;padding:24px 12px;color:#493029">',
    '<table role="presentation" cellspacing="0" cellpadding="0" style="max-width:820px;width:100%;margin:auto;border-collapse:collapse;background:#fffdf9;border:1px solid #ead8bc">',
    '<tr><td style="background:#6c211d;color:#fff3d9;padding:22px 26px"><div style="font-size:12px;letter-spacing:2px;color:#e9c78d">QUẢN LÝ HOẠT ĐỘNG CHÙA</div><h1 style="margin:8px 0 2px;font-size:22px;color:#fff">BẢN TỔNG HỢP NHẮC VIỆC</h1><div style="font-size:12px;color:#f5e0c0">Ngày '+reminderEscape_(dateLabel)+'</div></td></tr>',
    '<tr><td style="padding:23px 26px"><p style="margin:0 0 9px;font-size:14px">Kính gửi: <strong>'+reminderEscape_(recipient.name)+'</strong></p><p style="font-size:12px;line-height:1.6;color:#765e4c;margin:0 0 18px">Dưới đây là các nội dung cần theo dõi theo dữ liệu đang ghi nhận trong hệ thống.</p>',
    '<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate;border-spacing:6px"><tr>'];
  [['Quá hạn','late'],['Hôm nay','today'],['Sắp đến hạn','soon'],['Chờ xác nhận','approval']].forEach(function(k){html.push('<td style="width:25%;padding:12px 5px;border:1px solid #ead7bd;border-radius:8px;background:#fff8ee;text-align:center"><div style="font-size:11px;color:#786050">'+k[0]+'</div><strong style="display:block;font-size:22px;color:'+colors[k[1]]+'">'+summary[k[1]]+'</strong></td>');});
  html.push('</tr></table>');
  if(built.supervisor){
    var owners={};all.filter(function(x){return x.bucket==='late'&&x.section==='Công việc';}).forEach(function(x){owners[x.ownerName]=(owners[x.ownerName]||0)+1;});
    var grouped=Object.keys(owners).sort(function(a,b){return owners[b]-owners[a];}).slice(0,8);
    if(grouped.length){html.push('<h2 style="font-size:14px;color:#71231e;margin:20px 0 9px">Phân bổ công việc quá hạn theo người phụ trách</h2>');
      grouped.forEach(function(owner){html.push('<div style="padding:7px 0;border-bottom:1px solid #efdfc8;font-size:12px">'+reminderEscape_(owner)+' <strong style="float:right;color:#8c3529">'+owners[owner]+' việc</strong></div>');});}
  }
  sections.forEach(function(section){var items=all.filter(function(x){return x.bucket===section.bucket;});if(!items.length)return;
    html.push('<h2 style="font-size:14px;color:#71231e;border-bottom:2px solid #e7cc9f;padding-bottom:9px;margin:22px 0 9px">'+section.title+' ('+items.length+')</h2>');
    html.push('<table role="table" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;table-layout:fixed"><thead><tr style="background:#f6ebda;color:#6e3423">');
    ['Mã / Nhóm','Nội dung','Ngày hạn'].concat(built.supervisor?['Phụ trách']:[]).concat(['Trạng thái']).forEach(function(t){html.push('<th scope="col" style="border:1px solid #ecd9bd;padding:8px 6px;text-align:left;font-size:11px">'+t+'</th>');});html.push('</tr></thead><tbody>');
    items.slice(0,35).forEach(function(x,i){html.push('<tr style="background:'+(i%2?'#fffaf4':'#fffdf9')+'"><td style="border:1px solid #f0e1cb;padding:7px 6px;font-size:10px;overflow-wrap:anywhere">'+reminderEscape_(x.id)+'<div style="color:#ab783c">'+reminderEscape_(x.section)+'</div></td><td style="border:1px solid #f0e1cb;padding:7px 6px;font-size:11px;overflow-wrap:anywhere">'+reminderEscape_(x.title)+'</td><td style="border:1px solid #f0e1cb;padding:7px 6px;font-size:11px">'+reminderEscape_(x.due||'—')+'</td>');
      if(built.supervisor)html.push('<td style="border:1px solid #f0e1cb;padding:7px 6px;font-size:11px">'+reminderEscape_(x.ownerName)+'</td>');
      html.push('<td style="border:1px solid #f0e1cb;padding:7px 6px;font-size:11px">'+reminderEscape_(x.state||'—')+'</td></tr>');
    });html.push('</tbody></table>');if(items.length>35)html.push('<p style="font-size:11px;color:#93674f">Còn '+(items.length-35)+' mục không liệt kê chi tiết trong email này.</p>');
  });
  html.push('<p style="font-size:11px;color:#887360;margin:25px 0 0;border-top:1px solid #e9d8bd;padding-top:14px">Email tự động từ hệ thống quản lý hoạt động chùa. Vui lòng không trả lời thư này.</p></td></tr></table></div>');
  var text='BẢN TỔNG HỢP NHẮC VIỆC - '+dateLabel+'\nKính gửi: '+recipient.name+'\nQuá hạn: '+summary.late+' | Hôm nay: '+summary.today+' | Sắp hạn: '+summary.soon+' | Chờ xác nhận: '+summary.approval+'\n\n';
  sections.forEach(function(s){var rows=all.filter(function(x){return x.bucket===s.bucket;});if(!rows.length)return;text+=s.title+' ('+rows.length+')\n';rows.slice(0,35).forEach(function(x){text+='- '+x.id+' | '+x.title+' | hạn '+(x.due||'—')+' | '+x.state+'\n';});text+='\n';});
  text+='Email tự động từ hệ thống quản lý hoạt động chùa. Vui lòng không trả lời thư này.';
  return {subject:headline,htmlBody:html.join(''),body:text};
}
function reminderSnapshot_(){return {tasks:rows_('tasks'),employees:rows_('employees'),events:rows_('events'),intakes:rows_('intakes'),maintenance:rows_('maintenance'),assets:rows_('assets'),fees:rows_('fees')};}
function reminderLog_(recipient,content,built,key,dateLabel,dayIso){
  return appendAuto_('emails',{'Ngày gửi':new Date(),'Nhóm nhắc việc':REMINDER_EMAIL_GROUP,'Kỳ gửi':Utilities.formatDate(new Date(),REMINDER_EMAIL_TZ,'MM/yyyy'),
    'Người nhận':recipient.email,'Tiêu đề':content.subject,'Số mục':built.items.length,'Trạng thái':'Đang gửi','Thông báo lỗi':'',
    'Mã đợt gửi':dayIso,'Ngày tổng hợp':dayIso,'Loại bản tin':recipient.role,'Mã nhân sự':Array.from(recipient.ids).join(', '),
    'Số quá hạn':built.summary.late,'Số đến hạn hôm nay':built.summary.today,'Số sắp đến hạn':built.summary.soon,
    'Số chờ xác nhận':built.summary.approval,'Mã chống gửi trùng':key,'Thời điểm hoàn tất':''});
}
/* V8.8.2: email center configuration is kept separately in Script Properties.
 * Reading settings/preview does not run MailApp or create triggers. */
const REMINDER_CONFIG_PROP='chua_v882_email_config';
const REMINDER_SCOPES=['tasks','events','intakes','fees','maintenance','warranty'];
function reminderDefaultConfig_(){return {enabled:true,hour:8,daysAhead:7,weekdays:[1,2,3,4,5,6,7],scopes:REMINDER_SCOPES.slice(),roles:['Admin','Quản lý','Nhân sự']};}
function reminderConfig_(){
  var def=reminderDefaultConfig_(),raw=PropertiesService.getScriptProperties().getProperty(REMINDER_CONFIG_PROP);
  if(!raw)return def;
  try{return reminderValidateConfig_(JSON.parse(raw));}catch(e){return def;}
}
function reminderValidateConfig_(c){
  if(!c||typeof c!=='object')throw new Error('Dữ liệu thiết lập email không hợp lệ.');
  var hour=Number(c.hour),days=Number(c.daysAhead);
  if(!Number.isInteger(hour)||hour<5||hour>20)throw new Error('Giờ gửi chỉ nhận 05:00–20:00.');
  if(!Number.isInteger(days)||days<1||days>30)throw new Error('Số ngày nhắc trước hạn phải từ 1–30.');
  var uniq=function(a,valid){return Array.isArray(a)?Array.from(new Set(a.filter(function(x){return valid.indexOf(x)!==-1;}))):[];};
  var weekdays=uniq((c.weekdays||[]).map(Number),[1,2,3,4,5,6,7]);
  var scopes=uniq(c.scopes,REMINDER_SCOPES),roles=uniq(c.roles,['Admin','Quản lý','Nhân sự']);
  if(!weekdays.length||!scopes.length||!roles.length)throw new Error('Chọn ít nhất một ngày, loại nhắc và nhóm người nhận.');
  return {enabled:c.enabled===true,hour:hour,daysAhead:days,weekdays:weekdays,scopes:scopes,roles:roles};
}
function reminderTriggerState_(){
  var ts=ScriptApp.getProjectTriggers().filter(function(t){return t.getHandlerFunction()==='sendReminderEmailsScheduled_';});
  return {count:ts.length,hasTrigger:ts.length>0};
}
function reminderCheckPermission_(token,adminOnly){
  var actor=requireSession_(token);
  if(adminOnly?actor.role!=='Admin':!['Admin','Quản lý'].includes(actor.role))throw new Error('Bạn không có quyền quản lý email nhắc việc.');
  return actor;
}
function reminderList_(config,dayIso){
  var dat=reminderSnapshot_(),recipients=reminderRecipients_(),dayNum=reminderDayNumber_(dayIso);
  var eligible=recipients.filter(function(r){return config.roles.indexOf(r.role)>=0;});
  var withCounts=eligible.map(function(r){var b=reminderBuildItems_(r,dayNum,dat,config);
    return {email:r.email,name:r.name,role:r.role,ids:Array.from(r.ids),count:b.items.length,summary:b.summary};
  });
  // Aggregate full report only for permitted administrative readers.
  var all=reminderBuildItems_({ids:new Set(),role:'Admin',name:'Quản trị'},dayNum,dat,config);
  var ids=new Set();var items=all.items.filter(function(x){var k=x.section+'|'+x.id+'|'+x.bucket;if(ids.has(k))return false;ids.add(k);return true;});
  return {recipients:withCounts,summary:all.summary,items:items,eligibleCount:withCounts.filter(function(x){return x.count>0;}).length};
}
function getReminderEmailCenterData(token){
  var actor=reminderCheckPermission_(token,false),now=new Date(),iso=Utilities.formatDate(now,REMINDER_EMAIL_TZ,'yyyy-MM-dd');
  var config=reminderConfig_(),report=reminderList_(config,iso);
  var logs=rows_('emails').slice(-150).reverse().map(function(r){return {
    id:r['Mã lượt gửi'],date:r['Ngày gửi'],email:r['Người nhận'],subject:r['Tiêu đề'],count:r['Số mục'],status:r['Trạng thái'],error:r['Thông báo lỗi'],batch:r['Mã đợt gửi']};});
  return {success:true,config:config,trigger:reminderTriggerState_(),quota:MailApp.getRemainingDailyQuota(),report:report,logs:logs,
    today:iso,canEditSettings:actor.role==='Admin',timezone:REMINDER_EMAIL_TZ};
}
function saveReminderEmailSettings(settings,token){
  reminderCheckPermission_(token,true);var c=reminderValidateConfig_(settings),lock=LockService.getScriptLock();
  if(!lock.tryLock(12000))throw new Error('Có tác vụ email khác đang thực hiện. Vui lòng thử lại.');
  try{
    var previous=reminderConfig_(),existing=ScriptApp.getProjectTriggers().filter(function(t){return t.getHandlerFunction()==='sendReminderEmailsScheduled_';});
    // When schedule is enabled install first; only delete older triggers after successful creation.
    if(c.enabled&&(c.hour!==previous.hour||!existing.length||existing.length>1)){
      var newly=ScriptApp.newTrigger('sendReminderEmailsScheduled_').timeBased().everyDays(1).atHour(c.hour).inTimezone(REMINDER_EMAIL_TZ).create();
      existing.forEach(function(t){ScriptApp.deleteTrigger(t);});
    }else if(!c.enabled){existing.forEach(function(t){ScriptApp.deleteTrigger(t);});}
    PropertiesService.getScriptProperties().setProperty(REMINDER_CONFIG_PROP,JSON.stringify(c));
    return {success:true,config:c,trigger:reminderTriggerState_(),note:'Thời gian chạy Apps Script có thể dao động trong khung giờ đã đặt.'};
  }finally{lock.releaseLock();}
}
function getReminderEmailPreview(email,token){
  reminderCheckPermission_(token,false);
  var config=reminderConfig_(),rec=reminderRecipients_().find(function(x){return x.email===String(email||'').trim().toLowerCase();});
  if(!rec||config.roles.indexOf(rec.role)<0)throw new Error('Người nhận không hợp lệ hoặc không được phép nhận.');
  var iso=Utilities.formatDate(new Date(),REMINDER_EMAIL_TZ,'yyyy-MM-dd'),day=Utilities.formatDate(new Date(),REMINDER_EMAIL_TZ,'dd/MM/yyyy');
  var built=reminderBuildItems_(rec,reminderDayNumber_(iso),reminderSnapshot_(),config);
  if(!built.items.length)return {success:true,email:rec.email,count:0,html:'',subject:'',body:''};
  var content=reminderEmailContent_(rec,built,day);return {success:true,email:rec.email,count:built.items.length,html:content.htmlBody,subject:content.subject,body:content.body};
}
function sendReminderEmailsManual(recipientEmails,token){
  reminderCheckPermission_(token,false);
  if(!Array.isArray(recipientEmails)||recipientEmails.length<1||recipientEmails.length>20)throw new Error('Hãy chọn từ 1 đến 20 người nhận mỗi lượt.');
  var allowed=new Set(reminderRecipients_().map(function(x){return x.email;})),selected=Array.from(new Set(recipientEmails.map(function(v){return String(v).trim().toLowerCase();})));
  if(selected.some(function(v){return !allowed.has(v);}))throw new Error('Danh sách người nhận có địa chỉ ngoài phạm vi được phép.');
  return sendReminderEmailCore_({emails:selected,manual:true});
}
function sendReminderEmailCore_(options){
  options=options||{};var config=reminderConfig_();
  if(!options.manual&&!config.enabled)return {success:true,sent:0,skipped:0,disabled:true};
  if(!options.manual){var weekday=Number(Utilities.formatDate(new Date(),REMINDER_EMAIL_TZ,'u'));if(config.weekdays.indexOf(weekday)<0)return {success:true,sent:0,skipped:0,nonWorkingDay:true};}
  var lock=LockService.getScriptLock();if(!lock.tryLock(5000))return {success:false,reason:'Một lượt gửi khác đang chạy.',sent:0,skipped:0};
  try{
    var today=new Date(),iso=Utilities.formatDate(today,REMINDER_EMAIL_TZ,'yyyy-MM-dd'),day=Utilities.formatDate(today,REMINDER_EMAIL_TZ,'dd/MM/yyyy'),n=reminderDayNumber_(iso);
    // Đọc đầy đủ dữ liệu trước khi gửi; nếu một bảng nguồn hỏng, KHÔNG gửi tập dữ liệu thiếu.
    var data=reminderSnapshot_(),recipients=reminderRecipients_().filter(function(r){return config.roles.indexOf(r.role)>=0&&(!options.emails||options.emails.indexOf(r.email)>=0);}),logs=rows_('emails');
    var processed=new Set(logs.filter(function(x){return ['Thành công','Đang gửi','Cần kiểm tra'].includes(String(x['Trạng thái']));})
      .map(function(x){return String(x['Mã chống gửi trùng']||'');}).filter(Boolean));
    // Tương thích nhật ký cũ 9 cột: không gửi lặp các mail Công việc đã gửi hôm nay.
    logs.forEach(function(x){if(x['Nhóm nhắc việc']==='Công việc'&&x['Trạng thái']==='Thành công'&&String(x['Ngày gửi']||'').slice(0,10)===day){processed.add(reminderKey_(day,x['Người nhận']));}});
    var result={success:true,sent:0,skipped:0,failed:0,errors:[],date:day};
    var quota=MailApp.getRemainingDailyQuota();
    recipients.forEach(function(rec){
      var built=reminderBuildItems_(rec,n,data,config);if(!built.items.length){result.skipped++;return;}
      var key=reminderKey_(day,rec.email);if(processed.has(key)){result.skipped++;return;}
      if(quota<=0){result.failed++;result.errors.push('Đã hết hạn mức gửi mail trong ngày.');return;}
      var content=reminderEmailContent_(rec,built,day),log;
      try{log=reminderLog_(rec,content,built,key,day,iso);processed.add(key);}catch(e){result.failed++;result.errors.push('Không ghi được nhật ký '+rec.email+': '+e.message);return;}
      try{MailApp.sendEmail({to:rec.email,subject:content.subject,body:content.body,htmlBody:content.htmlBody,name:'Quản lý hoạt động chùa'});
        log['Trạng thái']='Thành công';quota--;result.sent++;
      }catch(e){log['Trạng thái']='Cần kiểm tra';log['Thông báo lỗi']=String(e.message||e).slice(0,700);
        result.failed++;result.errors.push(rec.email+': '+log['Thông báo lỗi']);}
      log['Thời điểm hoàn tất']=new Date();
      try{updateExisting_('emails',log);}catch(e){result.errors.push('Không cập nhật nhật ký '+rec.email+': '+e.message);}
    });
    result.success=result.failed===0&&result.errors.length===0;return result;
  }finally{lock.releaseLock();}
}
function sendReminderEmailsScheduled_(){return sendReminderEmailCore_();}
function installDailyReminderTrigger_(){
  var c=reminderConfig_();if(!c.enabled)throw new Error('Hãy bật chế độ tự động ở cấu hình trước khi cài lịch.');
  var triggers=ScriptApp.getProjectTriggers().filter(function(t){return t.getHandlerFunction()==='sendReminderEmailsScheduled_';});
  var fresh=ScriptApp.newTrigger('sendReminderEmailsScheduled_').timeBased().everyDays(1).atHour(c.hour).inTimezone(REMINDER_EMAIL_TZ).create();
  triggers.forEach(function(t){ScriptApp.deleteTrigger(t);});
  return 'Đã cài lịch theo thiết lập '+String(c.hour).padStart(2,'0')+':00–'+String(c.hour).padStart(2,'0')+':59 giờ Việt Nam.';
}
function getReminderEmailStatus(token){
  var actor=requireSession_(token);if(!['Admin','Quản lý'].includes(actor.role))throw new Error('Không có quyền xem cấu hình nhắc việc.');
  var triggers=reminderTriggerState_();
  return {success:true,triggerCount:triggers.count,config:reminderConfig_(),timezone:REMINDER_EMAIL_TZ,quota:MailApp.getRemainingDailyQuota(),
    note:'Chỉ hiển thị trigger được cài bởi tài khoản thực thi hiện tại. Chủ sở hữu có thể chạy installDailyReminderTrigger_() từ trình soạn thảo.'};
}
function sendReminderEmailTest(token){
  var actor=requireSession_(token);if(!['Admin','Quản lý'].includes(actor.role))throw new Error('Không có quyền kiểm tra email.');
  var employee=rows_('employees').find(function(r){return String(r['Mã nhân sự'])===String(actor.employeeId||'');});
  if(!employee||!reminderValidEmail_(employee.Email))throw new Error('Tài khoản chưa liên kết nhân sự có email hợp lệ.');
  var recipient=reminderRecipients_().find(function(r){return r.email===String(employee.Email).trim().toLowerCase();});
  if(!recipient)throw new Error('Địa chỉ thử chưa thuộc danh sách người nhận được phép.');
  var date=Utilities.formatDate(new Date(),REMINDER_EMAIL_TZ,'dd/MM/yyyy'),n=reminderDayNumber_(Utilities.formatDate(new Date(),REMINDER_EMAIL_TZ,'yyyy-MM-dd'));
  var built=reminderBuildItems_(recipient,n,reminderSnapshot_(),reminderConfig_());
  if(!built.items.length)throw new Error('Không có nội dung nhắc phù hợp để tạo email thử.');
  var content=reminderEmailContent_(recipient,built,date);content.subject='[KIỂM TRA] '+content.subject;
  MailApp.sendEmail({to:recipient.email,subject:content.subject,body:content.body,htmlBody:content.htmlBody,name:'Quản lý hoạt động chùa'});
  return {success:true,email:recipient.email,count:built.items.length};
}

/** V8.6: tải tối đa 6 ảnh nhỏ cho bảng/Card sau khi màn hình đã xuất hiện.
 * Không tải ảnh trong bootstrap, không cung cấp dữ liệu cho tài khoản ngoài quyền. */
function getSmallImagePreviews(fileIds,token){
  var actor=requireSession_(token);
  if(!Array.isArray(fileIds)||fileIds.length>6)throw new Error('Tối đa 6 ảnh/lượt.');
  if(!canRead_(actor,'files'))return {};
  var wanted=Array.from(new Set(fileIds.map(String))).filter(function(v){return /^[\w-]{12,150}$/.test(v);});
  if(!wanted.length)return {};
  var refs=rows_('files').filter(function(r){return wanted.indexOf(String(r['File ID']||''))!==-1&&r['Trạng thái']!=='Đã xóa'&&/^image\//.test(String(r['MIME type']))});
  var ans={};refs.forEach(function(r){
    var module=Object.keys(MODULES).find(function(k){return MODULES[k].sheet===r['Phân hệ'];});
    if(!module||!canRead_(actor,module))return;
    // Kiểm tra phạm vi hồ sơ của từng vai trò, không dùng metadata đơn thuần làm quyền.
    var allowed=scopeRows_(actor,module,rows_(module)).some(function(x){return String(x[MODULES[module].id])===String(r['Mã bản ghi liên kết']);});
    if(!allowed)return;
    try{var f=DriveApp.getFileById(r['File ID']);if(f.getSize()>450*1024)return;
      ans[r['File ID']]='data:'+r['MIME type']+';base64,'+Utilities.base64Encode(f.getBlob().getBytes());
    }catch(e){}
  });
  return ans;
}


/* ========================= V8.8.5: THƯ VIỆN & KỶ YẾU =========================
 * Đọc các tab mới trực tiếp từ SpreadsheetApp.getActiveSpreadsheet() (không cố định ID).
 * Không đọc Drive trong getBootstrapData(). Tất cả API đều xác thực token ở backend.
 */
const GALLERY_ALBUM_SHEET='Thư viện tư liệu';
const GALLERY_MEDIA_SHEET='Media tư liệu';
const GALLERY_ALBUM_COLS=['Mã tư liệu','Tên tư liệu','Nhóm tư liệu','Năm bắt đầu','Năm kết thúc','Thời gian hiển thị','Địa điểm','Nội dung chi tiết','Ảnh bìa File ID','Folder ID nguồn','Link thư mục nguồn','Mã sự kiện liên kết','Trạng thái','Nguồn tài liệu','Ghi chú'];
const GALLERY_MEDIA_COLS=['Mã media','Mã tư liệu','Nguồn media','Loại media','File ID','Folder ID','Tên file','MIME type','Link xem','Thứ tự','Chú thích','Trạng thái','Dung lượng KB','Thời gian tải lên','Mã tài khoản tải'];
const GALLERY_UPLOAD_ROOT_PROPERTY='CHUA_V885_GALLERY_UPLOAD_ROOT';
function galleryEditable_(actor){return ['Admin','Quản lý'].indexOf(actor.role)!==-1;}
function galleryEditor_(token){var actor=requireSession_(token);if(!galleryEditable_(actor))throw new Error('Chỉ Admin hoặc Quản lý được cập nhật tư liệu.');return actor;}
function galleryClean_(str,max){var s=String(str==null?'':str).trim();if(s.length>(max||8000))throw new Error('Nội dung quá dài, giới hạn '+(max||8000)+' ký tự.');return s;}
function gallerySheet_(name,fields){var sh=getSheet_(name);headerIndex_(sh,fields);return sh;}
function galleryRows_(name,fields){var sh=gallerySheet_(name,fields),last=sh.getLastRow();if(last<4)return [];
 var h=headerIndex_(sh,fields),data=sh.getRange(4,2,last-3,Math.max(1,sh.getLastColumn()-1)).getValues();
 return data.map(function(arr){var rec={};fields.forEach(function(f){rec[f]=fmtValue_(arr[h[f]],f);});return rec;}).filter(function(x){return String(x[fields[0]]||'').trim()!=='';});}
function galleryRowsToEntry_(fields,row){var obj={};fields.forEach(function(f,i){obj[f]=row[i];});return obj;}
function galleryNextId_(rows,field,prefix){var biggest=0;rows.forEach(function(r){var id=String(r[field]||'');if(id.indexOf(prefix)===0){var n=Number(id.slice(prefix.length));if(Number.isFinite(n))biggest=Math.max(n,biggest);}});return prefix+String(biggest+1).padStart(prefix==='MTV'?6:5,'0');}
function gallerySafeText_(value){var s=String(value==null?'':value);return /^[=+@]/.test(s)?"'"+s:s;}
function galleryWriteRow_(sheetName,fields,item,rowIndex){var sh=gallerySheet_(sheetName,fields),colMap=headerIndex_(sh,fields),wide=sh.getLastColumn()-1;
 var arr=rowIndex?sh.getRange(rowIndex,2,1,wide).getValues()[0]:new Array(wide).fill('');
 fields.forEach(function(f){var v=item[f];if(f==='Thời gian tải lên'&&typeof v==='string'&&/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(v)){var parts=v.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);arr[colMap[f]]=new Date(+parts[3],+parts[2]-1,+parts[1],+parts[4],+parts[5]);}else arr[colMap[f]]=v instanceof Date?v:typeof v==='number'?v:gallerySafeText_(v);});
 var target=rowIndex||Math.max(4,sh.getLastRow()+1);if(target>sh.getMaxRows())sh.insertRowsAfter(sh.getMaxRows(),Math.max(100,target-sh.getMaxRows()));
 sh.getRange(target,2,1,wide).setValues([arr]);}
function galleryRowNumber_(sheetName,field,id){var sh=getSheet_(sheetName),m=headerIndex_(sh,[field]),end=sh.getLastRow();if(end<4)return 0;
 var cells=sh.getRange(4,2+m[field],end-3,1).getDisplayValues();var i=cells.findIndex(function(v){return String(v[0])===String(id);});return i<0?0:i+4;}
function galleryVisible_(item,actor){return String(item['Trạng thái']||'')!=='Đã xóa'&&(galleryEditable_(actor)||String(item['Trạng thái']||'')==='Đã duyệt');}
function galleryGetIndex(token){var actor=requireSession_(token);var rows=galleryRows_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS).filter(function(a){return galleryVisible_(a,actor);});
 return {success:true,editable:galleryEditable_(actor),canDelete:actor.role==='Admin',albums:rows.map(function(a){return a;})};}
function galleryFolderId_(raw){var v=galleryClean_(raw,500);if(!v)return '';
 var m=v.match(/\/folders\/([A-Za-z0-9_-]{15,})/)||v.match(/^([A-Za-z0-9_-]{15,})$/);if(!m)throw new Error('Link thư mục Drive hoặc Folder ID không hợp lệ.');return m[1];}
function gallerySaveAlbum(payload,token){galleryEditor_(token);payload=payload||{};var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
 try{var rows=galleryRows_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS),id=galleryClean_(payload.id,32),old=id?rows.find(function(a){return a['Mã tư liệu']===id;}):null;
 if(id&&!old)throw new Error('Không tìm thấy tư liệu '+id);if(old&&old['Trạng thái']==='Đã xóa')throw new Error('Bộ sưu tập đã được xóa; không thể chỉnh sửa.');var item=old?Object.assign({},old):{};
 var name=galleryClean_(payload.name,240),group=galleryClean_(payload.group,120);if(!name||!group)throw new Error('Cần nhập tên và nhóm tư liệu.');
 item['Mã tư liệu']=old?id:galleryNextId_(rows,'Mã tư liệu','TLV');item['Tên tư liệu']=name;item['Nhóm tư liệu']=group;
 item['Thời gian hiển thị']=galleryClean_(payload.period,120);item['Địa điểm']=galleryClean_(payload.place,240);item['Nội dung chi tiết']=galleryClean_(payload.description,15000);
 var y=galleryClean_(payload.startYear,6),end=galleryClean_(payload.endYear,6);
 if(y&&(!/^\d{4}$/.test(y)||Number(y)<1000))throw new Error('Năm bắt đầu không hợp lệ.');if(end&&(!/^\d{4}$/.test(end)||Number(end)<1000))throw new Error('Năm kết thúc không hợp lệ.');
 if(y&&end&&Number(end)<Number(y))throw new Error('Năm kết thúc không được trước năm bắt đầu.');
 item['Năm bắt đầu']=y?Number(y):'';item['Năm kết thúc']=end?Number(end):'';
 var folder=galleryFolderId_(payload.folder||'');if(folder&&(!old||folder!==old['Folder ID nguồn'])){try{DriveApp.getFolderById(folder).getName();}catch(e){throw new Error('Không thể đọc thư mục Drive nguồn bằng tài khoản chạy Apps Script.');}}
 item['Folder ID nguồn']=folder;item['Link thư mục nguồn']=folder?'https://drive.google.com/drive/folders/'+folder:'';
 var status=galleryClean_(payload.status,30)||'Nháp';if(!['Nháp','Đã duyệt','Ẩn'].includes(status))throw new Error('Trạng thái tư liệu không hợp lệ.');item['Trạng thái']=status;
 var source=galleryClean_(payload.source,500);item['Nguồn tài liệu']=source||item['Nguồn tài liệu']||'';
 item['Ghi chú']=galleryClean_(payload.note,900);item['Mã sự kiện liên kết']=item['Mã sự kiện liên kết']||'';item['Ảnh bìa File ID']=item['Ảnh bìa File ID']||'';
 galleryWriteRow_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS,item,old?galleryRowNumber_(GALLERY_ALBUM_SHEET,'Mã tư liệu',id):0);
 return {success:true,album:item};}finally{lock.releaseLock();}}
/** V8.8.8: Xóa mềm bộ sưu tập, giữ toàn bộ metadata media và file gốc Drive.
 * Chỉ tài khoản Admin thực hiện được; không xóa dòng hoặc thay đổi mã TLV/MTV.
 * Có thể khôi phục bằng cách đổi Trạng thái trực tiếp trong Google Sheet. */
function galleryDeleteAlbum(albumId,token){
 var actor=requireSession_(token);
 if(actor.role!=='Admin')throw new Error('Chỉ Admin được xóa bộ sưu tập.');
 albumId=galleryClean_(albumId,32);
 if(!/^TLV\d{5,}$/.test(albumId))throw new Error('Mã bộ sưu tập không hợp lệ.');
 var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
 var mediaCount=0,albumName='';
 try{
  var album=galleryRows_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS).find(function(x){return String(x['Mã tư liệu'])===albumId;});
  if(!album)throw new Error('Bộ sưu tập không tồn tại.');
  if(String(album['Trạng thái'])==='Đã xóa')throw new Error('Bộ sưu tập đã được xóa trước đó.');
  var row=galleryRowNumber_(GALLERY_ALBUM_SHEET,'Mã tư liệu',albumId);
  if(!row)throw new Error('Không tìm thấy dòng dữ liệu cần xóa.');
  albumName=String(album['Tên tư liệu']||'');
  mediaCount=galleryRows_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS).filter(function(x){return String(x['Mã tư liệu'])===albumId;}).length;
  album['Trạng thái']='Đã xóa';
  galleryWriteRow_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS,album,row);
 }finally{lock.releaseLock();}
 try{auditAuth_(actor,'Xóa mềm bộ sưu tập',albumId+' · '+albumName+' · '+mediaCount+' file được giữ nguyên');}catch(ignore){}
 return {success:true,id:albumId,mediaCount:mediaCount,softDeleted:true,note:'Đã ẩn bộ sưu tập khỏi thư viện; Google Sheet và file gốc trên Drive được giữ nguyên.'};
}
function galleryRequireAlbum_(albumId,actor){var a=galleryRows_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS).find(function(r){return r['Mã tư liệu']===String(albumId);});
 if(!a||!galleryVisible_(a,actor))throw new Error('Không tìm thấy tư liệu hoặc bạn không có quyền xem.');return a;}
function galleryGetMedia(albumId,offset,limit,token){var actor=requireSession_(token),album=galleryRequireAlbum_(albumId,actor);
 offset=Math.max(0,Math.min(100000,Math.trunc(Number(offset)||0)));limit=Math.max(1,Math.min(42,Math.trunc(Number(limit)||24)));
 var all=galleryRows_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS).filter(function(m){return m['Mã tư liệu']===album['Mã tư liệu']&&!['Ẩn','Đã xóa'].includes(String(m['Trạng thái']||''));});
 all.sort(function(a,b){return (Number(a['Thứ tự'])||0)-(Number(b['Thứ tự'])||0)||String(a['Mã media']).localeCompare(String(b['Mã media']));});
 return {success:true,album:album,total:all.length,offset:offset,items:all.slice(offset,offset+limit),more:offset+limit<all.length,editable:galleryEditable_(actor),canDelete:actor.role==='Admin'};}
function galleryUploadRoot_(){var props=PropertiesService.getScriptProperties(),id=props.getProperty(GALLERY_UPLOAD_ROOT_PROPERTY),root=null;
 if(id){try{root=DriveApp.getFolderById(id);root.getName();}catch(e){root=null;}}
 if(!root){root=DriveApp.createFolder('CHUA V8 - THU VIEN & KY YEU - UPLOAD');props.setProperty(GALLERY_UPLOAD_ROOT_PROPERTY,root.getId());}return root;}
function galleryUploadFolder_(albumId){var root=galleryUploadRoot_(),folders=root.getFoldersByName(albumId);return folders.hasNext()?folders.next():root.createFolder(albumId);}
function galleryUploadMedia(payload,token){galleryEditor_(token);payload=payload||{};var actor=requireSession_(token),album=galleryRequireAlbum_(payload.albumId,actor);
 var mime=galleryClean_(payload.mime,90).toLowerCase(),name=galleryClean_(payload.name,180).replace(/[\\/\x00-\x1f]/g,'_');
 if(!/^(image\/(jpeg|png|webp|gif|heic|heif)|application\/pdf|video\/(mp4|webm))$/.test(mime))throw new Error('Chỉ hỗ trợ ảnh JPG/PNG/WebP/GIF, PDF hoặc video MP4/WebM dung lượng nhỏ.');
 if(!name||!payload.data||typeof payload.data!=='string'||payload.data.length>18*1024*1024)throw new Error('File rỗng hoặc vượt quá giới hạn tải 12 MB.');
 var bytes;try{bytes=Utilities.base64Decode(payload.data);}catch(e){throw new Error('Dữ liệu file không hợp lệ.');}
 if(!bytes.length||bytes.length>12*1024*1024)throw new Error('Mỗi file tối đa 12 MB.');
 // Upload ra Drive ngoài document lock; chỉ giữ lock trong đoạn thêm metadata để giảm contention.
 var file=galleryUploadFolder_(album['Mã tư liệu']).createFile(Utilities.newBlob(bytes,mime,name));
 var lock=LockService.getDocumentLock()||LockService.getScriptLock();try{lock.waitLock(20000);
 galleryRequireAlbum_(album['Mã tư liệu'],actor);
 var all=galleryRows_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS),items=all.filter(function(r){return r['Mã tư liệu']===album['Mã tư liệu'];});
 var order=items.reduce(function(s,r){return Math.max(s,Number(r['Thứ tự'])||0);},0)+1;
 var item={'Mã media':galleryNextId_(all,'Mã media','MTV'),'Mã tư liệu':album['Mã tư liệu'],'Nguồn media':'Upload Web App','Loại media':mime.indexOf('image/')===0?'Ảnh':mime.indexOf('video/')===0?'Video':'PDF',
 'File ID':file.getId(),'Folder ID':file.getParents().hasNext()?file.getParents().next().getId():'','Tên file':name,'MIME type':mime,'Link xem':file.getUrl(),'Thứ tự':order,'Chú thích':'','Trạng thái':'','Dung lượng KB':Math.round(bytes.length/1024*100)/100,'Thời gian tải lên':new Date(),'Mã tài khoản tải':actor.userId};
 galleryWriteRow_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS,item,0);
 if(mime.indexOf('image/')===0&&!album['Ảnh bìa File ID']){album['Ảnh bìa File ID']=file.getId();galleryWriteRow_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS,album,galleryRowNumber_(GALLERY_ALBUM_SHEET,'Mã tư liệu',album['Mã tư liệu']));}
 return {success:true,media:Object.assign({},item,{'Thời gian tải lên':Utilities.formatDate(item['Thời gian tải lên'],Session.getScriptTimeZone()||'Asia/Ho_Chi_Minh','dd/MM/yyyy HH:mm')})};
 }catch(e){try{file.setTrashed(true);}catch(ignore){}throw e;}finally{try{lock.releaseLock();}catch(ignore){}}}
function gallerySyncAlbum(albumId,token){galleryEditor_(token);var actor=requireSession_(token),album=galleryRequireAlbum_(albumId,actor),folderId=String(album['Folder ID nguồn']||'');
 if(!folderId)throw new Error('Album chưa có Folder ID nguồn. Hãy bổ sung trong phần chỉnh sửa.');
 var folder;try{folder=DriveApp.getFolderById(folderId);}catch(e){throw new Error('Không đọc được thư mục Drive nguồn.');}
 var names={};galleryRows_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS).filter(function(x){return x['Mã tư liệu']===albumId;}).forEach(function(x){names[x['File ID']]=true;});
 var iterator=folder.getFiles(),add=[],n=0,limit=120;while(iterator.hasNext()&&add.length<limit){var f=iterator.next(),type=f.getMimeType();if(!/^(image\/|video\/|application\/pdf$)/.test(type))continue;var fid=f.getId();if(names[fid])continue;
 names[fid]=true;n++;add.push({id:fid,name:f.getName(),mime:type,url:f.getUrl(),size:f.getSize()});}
 var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);try{
 galleryRequireAlbum_(albumId,actor);
 var all=galleryRows_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS),same=all.filter(function(x){return x['Mã tư liệu']===albumId;});var max=same.reduce(function(s,x){return Math.max(s,Number(x['Thứ tự'])||0);},0),next=Number(galleryNextId_(all,'Mã media','MTV').slice(3));
 var seen=new Set(same.map(function(x){return String(x['File ID']);})),created=0;
 add.forEach(function(a){if(seen.has(a.id))return;seen.add(a.id);var m={'Mã media':'MTV'+String(next++).padStart(6,'0'),'Mã tư liệu':albumId,'Nguồn media':'Drive có sẵn','Loại media':a.mime.indexOf('image/')===0?'Ảnh':a.mime.indexOf('video/')===0?'Video':'PDF','File ID':a.id,'Folder ID':folderId,'Tên file':a.name,'MIME type':a.mime,'Link xem':a.url,'Thứ tự':++max,'Chú thích':'','Trạng thái':'','Dung lượng KB':Math.round(Number(a.size||0)/1024*100)/100,'Thời gian tải lên':'','Mã tài khoản tải':''};
 galleryWriteRow_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS,m,0);created++;if(!album['Ảnh bìa File ID']&&m['Loại media']==='Ảnh')album['Ảnh bìa File ID']=a.id;});
 if(created&&album['Ảnh bìa File ID'])galleryWriteRow_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS,album,galleryRowNumber_(GALLERY_ALBUM_SHEET,'Mã tư liệu',albumId));
 return {success:true,added:created,hasMore:iterator.hasNext(),note:'Chỉ đồng bộ file trực tiếp trong thư mục. Không xóa ảnh đã upload hoặc các liên kết có sẵn.'};
 }finally{lock.releaseLock();}}
function gallerySetCover(albumId,mediaId,token){galleryEditor_(token);var actor=requireSession_(token),album=galleryRequireAlbum_(albumId,actor);
 var item=galleryRows_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS).find(function(x){return x['Mã media']===mediaId&&x['Mã tư liệu']===albumId&&x['Loại media']==='Ảnh'&&!['Ẩn','Đã xóa'].includes(String(x['Trạng thái']||''));});
 if(!item)throw new Error('Ảnh bìa không thuộc album này.');var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
 try{galleryRequireAlbum_(albumId,actor);album['Ảnh bìa File ID']=item['File ID'];galleryWriteRow_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS,album,galleryRowNumber_(GALLERY_ALBUM_SHEET,'Mã tư liệu',albumId));return {success:true,album:album};}finally{lock.releaseLock();}}
function galleryHideMedia(albumId,mediaId,token){galleryEditor_(token);var actor=requireSession_(token),album=galleryRequireAlbum_(albumId,actor);
 var item=galleryRows_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS).find(function(x){return x['Mã media']===mediaId&&x['Mã tư liệu']===albumId;});if(!item)throw new Error('Không tìm thấy ảnh trong album.');
 var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);try{galleryRequireAlbum_(albumId,actor);item['Trạng thái']='Ẩn';galleryWriteRow_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS,item,galleryRowNumber_(GALLERY_MEDIA_SHEET,'Mã media',mediaId));
 if(album['Ảnh bìa File ID']===item['File ID']){album['Ảnh bìa File ID']='';galleryWriteRow_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS,album,galleryRowNumber_(GALLERY_ALBUM_SHEET,'Mã tư liệu',albumId));}
 return {success:true,note:'Đã ẩn ảnh khỏi album. Không xóa file gốc trên Google Drive.'};}finally{lock.releaseLock();}}
function gallerySaveMediaNote(albumId,mediaId,note,token){galleryEditor_(token);var actor=requireSession_(token);galleryRequireAlbum_(albumId,actor);
 var item=galleryRows_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS).find(function(x){return x['Mã media']===mediaId&&x['Mã tư liệu']===albumId;});if(!item)throw new Error('Không tìm thấy file.');
 var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);try{galleryRequireAlbum_(albumId,actor);item['Chú thích']=galleryClean_(note,500);galleryWriteRow_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS,item,galleryRowNumber_(GALLERY_MEDIA_SHEET,'Mã media',mediaId));return {success:true,media:item};}finally{lock.releaseLock();}}


/** V8.8.6: Chỉnh sửa media trong bộ sưu tập sau khi lưu ảnh mới.
 * Không xóa file gốc, không copy Drive, không làm thay đổi những album khác. */
function gallerySaveMediaLayout(payload,token){
 var actor=galleryEditor_(token);payload=payload||{};
 var albumId=galleryClean_(payload.albumId,32),updates=Array.isArray(payload.items)?payload.items:[];
 if(updates.length>700)throw new Error('Tối đa 700 bản ghi trong một lần chỉnh sửa.');
 if(payload.coverMediaId&&String(payload.coverMediaId).length>40)throw new Error('Mã ảnh bìa không hợp lệ.');
 var lock=LockService.getDocumentLock()||LockService.getScriptLock();lock.waitLock(20000);
 try{
  var album=galleryRequireAlbum_(albumId,actor),all=galleryRows_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS);
  var own=all.filter(function(x){return String(x['Mã tư liệu'])===albumId;});
  var original={};all.forEach(function(x){original[x['Mã media']]=JSON.stringify(x);});
  var map={};own.forEach(function(x){map[String(x['Mã media'])]=x;});
  var seen={};updates.forEach(function(p){
   var id=String(p.id||'');if(!id||seen[id]||!map[id])throw new Error('Ảnh không thuộc bộ sưu tập hoặc mã bị lặp: '+id);
   seen[id]=true;
  });
  var changing=false;
  updates.forEach(function(p){
    var m=map[String(p.id)],text=galleryClean_(p.caption,500);
    if(m['Chú thích']!==text){m['Chú thích']=text;changing=true;}
    if(p.hidden===true&&m['Trạng thái']!=='Ẩn'){m['Trạng thái']='Ẩn';changing=true;}
  });
  var active=own.filter(function(x){return !['Ẩn','Đã xóa'].includes(String(x['Trạng thái']||''));});
  var orderIds=Array.isArray(payload.order)?payload.order.map(String):[];
  if(orderIds.length>700)throw new Error('Danh sách thứ tự quá dài.');
  var orderSeen={};orderIds.forEach(function(id){if(orderSeen[id]||!map[id])throw new Error('Thứ tự file không hợp lệ.');orderSeen[id]=true;});
  active.sort(function(a,b){return (Number(a['Thứ tự'])||0)-(Number(b['Thứ tự'])||0)||String(a['Mã media']).localeCompare(String(b['Mã media']));});
  var activeById={};active.forEach(function(x){activeById[x['Mã media']]=x;});
  var ordered=orderIds.map(function(id){return activeById[id];}).filter(Boolean);
  active.forEach(function(x){if(!orderSeen[x['Mã media']])ordered.push(x);});
  ordered.forEach(function(x,i){if(Number(x['Thứ tự'])!==i+1){x['Thứ tự']=i+1;changing=true;}});
  var cover=payload.coverMediaId==null?'':String(payload.coverMediaId);
  if(cover){var item=map[cover];if(!item||item['Loại media']!=='Ảnh'||['Ẩn','Đã xóa'].includes(String(item['Trạng thái']||'')))throw new Error('Ảnh bìa không tồn tại hoặc đã bị ẩn.');
   if(album['Ảnh bìa File ID']!==item['File ID']){album['Ảnh bìa File ID']=item['File ID'];changing=true;}
  }else if(payload.clearCover===true){if(album['Ảnh bìa File ID']){album['Ảnh bìa File ID']='';changing=true;}}
  if(album['Ảnh bìa File ID']&&!active.some(function(x){return x['File ID']===album['Ảnh bìa File ID'];})){
    album['Ảnh bìa File ID']=ordered.find(function(x){return x['Loại media']==='Ảnh';})?.['File ID']||'';changing=true;
  }
  // Ghi chỉ những dòng có thay đổi, so với snapshot giá trị ban đầu.
  var original={};all.forEach(function(x){original[x['Mã media']]=JSON.stringify(x);});
  var targetSheet=getSheet_(GALLERY_MEDIA_SHEET),targets={};if(own.length){var ids=targetSheet.getRange(4,2,Math.max(1,targetSheet.getLastRow()-3),1).getDisplayValues();ids.forEach(function(row,i){if(row[0])targets[row[0]]=i+4;});}
  var count=0;own.forEach(function(x){if(original[x['Mã media']]!==JSON.stringify(x)){
   galleryWriteRow_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS,x,targets[x['Mã media']]||0);count++;
  }});
  if(changing)galleryWriteRow_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS,album,galleryRowNumber_(GALLERY_ALBUM_SHEET,'Mã tư liệu',albumId));
  return {success:true,updated:count,album:album};
 }finally{lock.releaseLock();}
}

/** Fallback ảnh riêng tư: chỉ đọc file được gắn vào tư liệu mà phiên hiện tại có quyền xem.
 * Dùng khi thumbnail Drive bị chặn trong iframe; giới hạn để không làm nặng ứng dụng. */
function galleryGetImageData(fileId,token){var actor=requireSession_(token);fileId=String(fileId||'').trim();
 if(!/^[A-Za-z0-9_-]{10,}$/.test(fileId))throw new Error('File ID ảnh không hợp lệ.');
 var attached=galleryRows_(GALLERY_MEDIA_SHEET,GALLERY_MEDIA_COLS).filter(function(m){return String(m['File ID'])===fileId&&m['Loại media']==='Ảnh'&&!['Ẩn','Đã xóa'].includes(String(m['Trạng thái']||''));});
 if(!attached.length)throw new Error('Ảnh chưa được liên kết vào thư viện.');
 var albums=galleryRows_(GALLERY_ALBUM_SHEET,GALLERY_ALBUM_COLS).filter(function(a){return galleryVisible_(a,actor);});
 if(!attached.some(function(m){return albums.some(function(a){return a['Mã tư liệu']===m['Mã tư liệu'];});}))throw new Error('Bạn không có quyền xem ảnh này.');
 var file;try{file=DriveApp.getFileById(fileId);}catch(e){throw new Error('Không đọc được ảnh gốc trên Drive.');}
 var mime=String(file.getMimeType()||'');if(!/^image\/(jpeg|png|webp|gif)$/i.test(mime))throw new Error('File không phải định dạng ảnh cho phép.');
 if(file.getSize()>4*1024*1024)return {success:false,tooLarge:true,note:'Ảnh gốc lớn hơn 4 MB, mở trên Drive để xem đầy đủ.'};
 return {success:true,dataUrl:'data:'+mime+';base64,'+Utilities.base64Encode(file.getBlob().getBytes())};
}
