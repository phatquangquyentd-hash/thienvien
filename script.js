'use strict';
/*
 * WEB APP QUẢN LÝ HOẠT ĐỘNG CHÙA V8 - PART 3
 * Giữ UX core từ phôi: SPA, sidebar, modal, toast, tooltip, combobox, Wizard.
 * Bổ sung đăng nhập và RBAC. Giữ SPA state-first và lazy/deferred của Part 2.
 */
const APP={data:{modules:{},categories:{},schema:{},fixedOptions:{}},state:{page:'dashboard',search:{},filters:{},pageNo:{},pageSize:{},sort:{},period:{},form:null,wizard:null,combo:null,import:null,upload:null},charts:{},busy:false,deferredStatus:'pending',scripts:{},localVersion:{},bootGeneration:0,token:'',session:null,permissions:{pages:[],write:[],delete:[],read:[]}};
const REF_NAME={products:'Tên sản phẩm',stores:'Tên kho',vendors:'Tên nhà cung cấp',purchases:'Mã phiếu nhập',orders:'Mã đơn bán',assets:'Tên tài sản',supplies:'Tên vật tư',funds:'Tên quỹ',vehicles:'Biển số',loans:'Mã phiếu mượn',feeReceipts:'Mã thu học phí',employees:'Họ tên',people:'Họ tên',classes:'Tên nhóm lớp',sessions:'Nội dung',exams:'Tên kỳ thi',slots:'Khu',memorials:'Họ tên người được thờ',events:'Tên sự kiện',guests:'Họ tên',tasks:'Tiêu đề'};
const PAGE_DESC={gallery:'Lưu giữ những cột mốc lịch sử, hình ảnh và kỷ yếu của Thiền viện',emailCenter:'Thiết lập nhắc việc, xem trước và đối soát email tự động',employees:'Thông tin nhân sự phục vụ phân công và quản lý',people:'Hồ sơ Phật tử và người tham gia sinh hoạt',classes:'Nhóm lớp, giảng viên và lịch sinh hoạt',memberships:'Danh sách thành viên theo từng nhóm lớp',sessions:'Lịch buổi sinh hoạt theo nhóm lớp',attendance:'Theo dõi điểm danh từng buổi',exams:'Kế hoạch kiểm tra và kỳ thi',results:'Kết quả thi, cấp đai và thành tích',fees:'Các khoản phải thu theo kỳ; thu/hoàn tiền ở Part 2',slots:'Sơ đồ và mã vị trí Nhà Linh',memorials:'Hồ sơ người được thờ và vị trí liên kết',memorialHistory:'Nhật ký thay đổi vị trí Nhà Linh',events:'Quản lý các sự kiện và lịch lễ',guests:'Thông tin khách mời dùng lại trong các sự kiện',invitations:'Quản lý thư mời theo sự kiện',tasks:'Phân công và theo dõi tiến độ công việc',intakes:'Tiếp nhận và xử lý yêu cầu'};
const STATUS_COLOR={'Hoàn thành':'green','Hoạt động':'green','Đã xác nhận':'green','Đã sử dụng':'green','Có mặt':'green','Đạt':'green','Đang thực hiện':'blue','Đang xử lý':'blue','Chờ xác nhận':'orange','Chờ duyệt':'orange','Chưa bắt đầu':'gray','Bình thường':'blue','Vắng':'red','Khẩn cấp':'red','Cao':'orange','Đã hủy':'red','Tạm dừng':'gray','Còn trống':'blue'};
const MODULE_STATE={employees:['Hoạt động','Tạm nghỉ','Đã nghỉ'],people:['Hoạt động','Tạm ngừng'],classes:['Hoạt động','Tạm dừng','Kết thúc'],memberships:['Hoạt động','Tạm ngừng','Kết thúc'],sessions:['Dự kiến','Đã xác nhận','Hoàn thành','Đã hủy'],exams:['Dự kiến','Đang diễn ra','Hoàn thành','Đã hủy'],fees:['Chưa thu','Thu một phần','Đã thu','Quá hạn','Đã hủy'],slots:['Còn trống','Đã sử dụng','Tạm khóa'],memorials:['Hoạt động','Chuyển vị trí','Kết thúc'],events:['Dự kiến','Đã xác nhận','Đang diễn ra','Hoàn thành','Đã hủy'],tasks:['Chưa bắt đầu','Đang thực hiện','Chờ xác nhận','Hoàn thành','Tạm dừng','Đã hủy'],intakes:['Mới tiếp nhận','Đang xử lý','Hoàn thành','Đã hủy']};

Object.assign(MODULE_STATE,{"feeReceipts":["Nháp","Chờ xác nhận","Đã xác nhận","Đã hủy"],"feeRefunds":["Đề nghị","Chờ duyệt","Đã duyệt","Đã hủy"],"stores":["Hoạt động","Ngừng hoạt động"],"vendors":["Hoạt động","Tạm ngừng"],"products":["Đang bán","Ngừng bán"],"purchases":["Nháp","Chờ xác nhận","Đã xác nhận","Đã hủy"],"orders":["Nháp","Chờ xác nhận","Đã xác nhận","Hoàn thành","Đã hủy"],"orderReceipts":["Nháp","Đã xác nhận","Đã hủy"],"returns":["Nháp","Chờ xác nhận","Đã xác nhận","Đã hủy"],"transfers":["Nháp","Chờ xác nhận","Đã xác nhận","Đã hủy"],"stocktakes":["Nháp","Chờ duyệt","Đã xác nhận","Đã hủy"],"supplies":["Hoạt động","Ngừng sử dụng"],"supplyIssues":["Nháp","Đã xác nhận","Đã hủy"],"loans":["Đang mượn","Trả một phần","Đã trả đủ"],"assets":["Đang sử dụng","Bảo dưỡng","Thanh lý"],"warranties":["Đang bảo hành","Đã hoàn tất"],"maintenance":["Dự kiến","Hoàn thành","Đã hủy"],"vehicles":["Hoạt động","Bảo dưỡng","Tạm ngừng"],"trips":["Dự kiến","Đang đi","Hoàn thành","Đã hủy"],"parking":["Đang gửi","Đã trả xe","Đã thu"],"funds":["Hoạt động","Tạm ngừng"],"finance":["Nháp","Đã xác nhận","Đã hủy"]});
const PAGE_ICON={gallery:'collections',emailCenter:'mail',reports:'monitoring',dashboard:'dashboard','action-center':'notification_important',categories:'tune'};
const DASHBOARD_DATES={events:'Ngày dương lịch',sessions:'Ngày sinh hoạt',tasks:'Ngày giao',intakes:'Ngày tiếp nhận',fees:'Ngày đến hạn'};
MODULE_STATE.users=['Hoạt động','Tạm khóa'];
const MAX_PREVIEW_COLS=8;
const BLOCKED_TRANSACTION_KEYS=new Set(['purchases','orders','transfers','returns','stocktakes','feeReceipts','feeRefunds','orderReceipts','memorials','loans','loanReturns']);

/* -------- Khởi động độc lập, timeout + fallback -------- */
/* -------- STARTUP PART 3: xác thực trước, preload một lần sau login -------- */
const AUTH_STORAGE_KEY='chua_v8_auth_token';
/* Trình duyệt nhúng Apps Script có thể chặn localStorage/sessionStorage. */
function safeStoreGet(key){
  for(const storage of ['localStorage','sessionStorage']){
    try{const value=window[storage].getItem(key);if(value!==null)return value;}catch(e){}
  }
  return '';
}
function safeStoreSet(key,value){
  for(const storage of ['localStorage','sessionStorage']){
    try{window[storage].setItem(key,String(value));return true;}catch(e){}
  }
  return false;
}
function safeStoreRemove(key){
  for(const storage of ['localStorage','sessionStorage']){
    try{window[storage].removeItem(key);}catch(e){}
  }
}
document.addEventListener('DOMContentLoaded',function(){
  window.__CHUA_BOOT_STARTED=true;
  try{
    registerEvents();initLightTheme();selectPeriod('this-month',false);bindLogin();
    Promise.resolve(initializeApp()).catch(startupFail);
  }catch(e){startupFail(e);}
});
function bindLogin(){
  document.getElementById('login-form')?.addEventListener('submit',handleLogin);
  document.getElementById('toggle-password')?.addEventListener('click',()=>{const field=document.getElementById('login-password');if(!field)return;field.type=field.type==='password'?'text':'password';});
}
function setAuthUi(session,permissions){APP.session=session||null;APP.permissions=permissions||{pages:[],read:[],write:[],delete:[]};
  setText('top-user-name',session?.displayName||session?.username||'Người dùng');setText('top-user-role',session?.role||'');
  setText('top-avatar',String(session?.displayName||session?.username||'U').trim().slice(0,1).toUpperCase());
  document.querySelectorAll('.nav-item[data-page]').forEach(el=>el.classList.toggle('hidden',!canPage(el.dataset.page)));
  document.querySelectorAll('.nav-group').forEach(group=>group.classList.toggle('hidden',!group.querySelector('.nav-item[data-page]:not(.hidden)')));
}
function canPage(page){return (APP.permissions.pages||[]).includes(page);}
function canRead(key){return (APP.permissions.read||[]).includes(key);}
function canWrite(key){return (APP.permissions.write||[]).includes(key);}
function canDelete(key){return (APP.permissions.delete||[]).includes(key);}
function guardAction(action,key){
  const writes=['new-row','edit-row','save-row','new-wizard','wizard-save','wizard-add','wizard-copy','wizard-remove','wizard-remove-blank','wizard-duplicate-last','wizard-toggle-row','wizard-collapse-all','wizard-expand-all','wizard-next','wizard-back','wizard-file-select','wizard-file-remove','open-import','import-read','import-save'];
  if(writes.includes(action))return canWrite(key||APP.state.form?.key||APP.state.wizard?.key||APP.state.import?.key);
  if(['delete-row'].includes(action))return canDelete(key);
  if(['new-category','edit-category','save-category','delete-category','category-next','category-back'].includes(action))return Boolean(APP.permissions.canManageCategories);
  if(['upload-file','attach-row','upload-select','upload-save'].includes(action))return Boolean(APP.permissions.canUpload)&&(action==='attach-row'?canWrite(key):true);
  if(action==='delete-file')return Boolean(APP.permissions.canDeleteFile);
  if(['email-config','email-test'].includes(action)||action.indexOf('ec-')===0)return Boolean(APP.permissions.canSendEmails);
  if(action==='load-heavy-report')return Boolean(APP.permissions.canReport);
  if(['view-row','view-file','export-xlsx','download-template'].includes(action))return !key||canRead(key)&&(key!=='users'||action==='view-row');
  return true;
}
function showLogin(message=''){
  hideEl('loading-screen');hideEl('app-container');hideEl('user-dropdown');showEl('login-view');window.__CHUA_BOOT_COMPLETE=true;
  const e=document.getElementById('login-error');if(e){e.textContent=message;e.classList.toggle('hidden',!message);}
  APP.data={modules:{},categories:{},schema:{},fixedOptions:{}};
  APP.bootGeneration++;APP.deferredStatus='pending';APP.session=null;APP.permissions={pages:[],read:[],write:[],delete:[]};
  setTimeout(()=>document.getElementById('login-username')?.focus(),20);
}
function clearAuth(){safeStoreRemove(AUTH_STORAGE_KEY);APP.token='';APP.session=null;APP.permissions={pages:[],read:[],write:[],delete:[]};}
function onAuthExpired(msg){if(!APP.token)return;clearAuth();showLogin(msg||'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');}
async function initializeApp(){
  APP.token=safeStoreGet(AUTH_STORAGE_KEY)||'';
  if(!APP.token){showLogin();return;}
  showEl('loading-screen');hideEl('login-view');hideEl('app-container');hideEl('loading-retry');
  setText('loading-heading','Đang kiểm tra phiên đăng nhập');setText('loading-status','Đang xác thực phiên');
  try{
    const s=await gas('getSessionInfo',{timeout:22000});APP.session=s.session;
    await bootstrapAuthenticated();
  }catch(e){if(/AUTH_REQUIRED/.test(e.message)){clearAuth();showLogin('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');}
    else startupFail(e);}
}
async function handleLogin(event){
  event.preventDefault();const btn=document.getElementById('login-submit'),username=document.getElementById('login-username').value.trim(),password=document.getElementById('login-password').value;
  const error=document.getElementById('login-error');hideEl('login-error');btn.disabled=true;
  try{
    const result=await gas('checkLogin',username,password,{timeout:30000});
    APP.token=result.token;APP.session=result.session;safeStoreSet(AUTH_STORAGE_KEY,result.token);
    document.getElementById('login-password').value='';hideEl('login-view');showEl('loading-screen');
    await bootstrapAuthenticated();
  }catch(e){if(APP.token&&/AUTH_REQUIRED/.test(e.message)){clearAuth();showLogin('Phiên đăng nhập không hợp lệ.');}
    else if(APP.token){startupFail(e);}else{if(error){error.textContent=e.message;showEl('login-error');}showEl('login-view');hideEl('loading-screen');}}
  finally{btn.disabled=false;}
}
async function bootstrapAuthenticated(){
  showEl('loading-screen');hideEl('app-container');hideEl('login-view');hideEl('loading-retry');
  setText('loading-heading','Đang chuẩn bị dữ liệu');setText('loading-status','Đang preload dữ liệu theo quyền');
  setText('loading-description','Tác vụ Drive, email và thư viện Excel không chạy trong bootstrap.');
  try{
    const data=await gas('getBootstrapData',{timeout:90000}),expected=document.querySelector('meta[name="app-build"]')?.content||'';
    if(expected&&!expected.includes('appVersion')&&expected!==data.version)throw Error('Giao diện và backend chưa cùng phiên bản. Hãy triển khai lại bản mới.');
    APP.bootGeneration++;APP.data=data;setAuthUi(data.session,data.permissions);
    hideEl('loading-screen');showEl('app-container');window.__CHUA_BOOT_COMPLETE=true;setPage(canPage(APP.state.page)?APP.state.page:'dashboard');notifications();scheduleDeferredData();
  }catch(e){if(/AUTH_REQUIRED/.test(e.message)){onAuthExpired('Tài khoản hoặc phiên đăng nhập không hợp lệ.');}
    else startupFail(e);}
}
function startupFail(e){showEl('loading-screen');hideEl('app-container');hideEl('login-view');
  setText('loading-heading','Không thể tải dữ liệu');setText('loading-status',e.message||'Có lỗi khi tải dữ liệu.');
  setText('loading-description','Bấm Thử lại để kiểm tra lại phiên và đồng bộ. Không có loading vô hạn.');showEl('loading-retry');console.error(e);
}
async function doLogout(){const token=APP.token;try{if(token)await gas('logout',{timeout:12000});}catch(e){}
  clearAuth();closeModal();closePreview();showLogin();
}
const API_URL='https://script.google.com/macros/s/AKfycbz-n9ztJiJQth6rAFp6eJAG2xwGAdrFxVtn89WARzHXvsauxcZfaJrk9ggnb6W7KkK9gQ/exec';
function gas(fn,...args){let opts={};if(args.length&&args[args.length-1]?.timeout)opts=args.pop();
  const requiresToken=!['checkLogin'].includes(fn);if(requiresToken)args.push(APP.token);
  return new Promise((resolve,reject)=>{
    let done=false;
    const timer=setTimeout(()=>{
      if(!done){done=true;reject(Error('Yêu cầu quá thời gian cho phép ('+(opts.timeout||60000)/1000+' giây).'));}
    },opts.timeout||60000);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      redirect: "follow",
      body: JSON.stringify({fn, args})
    })
      .then(r=>r.json())
      .then(v=>{if(done)return;done=true;clearTimeout(timer);
        if(v&&v.error){const message=v.error.message||String(v.error);
          if(requiresToken&&/AUTH_REQUIRED/.test(message)&&fn!=='getSessionInfo')onAuthExpired('Phiên đăng nhập đã hết hạn hoặc tài khoản bị khóa.');reject(Error(message));}
        else resolve(v&&v.result!==undefined?v.result:v);})
      .catch(e=>{if(done)return;done=true;clearTimeout(timer);reject(e);});
  });
}
function showMyProfile(){hideEl('user-dropdown');const s=APP.session||{};
  modal('Thông tin tài khoản','Phiên đăng nhập hiện tại.',`<div class="record-view-grid"><div class="record-view-item"><small>Tên đăng nhập</small><strong>${esc(s.username||'-')}</strong></div><div class="record-view-item"><small>Họ tên</small><strong>${esc(s.displayName||'-')}</strong></div><div class="record-view-item"><small>Vai trò</small><strong>${esc(s.role||'-')}</strong></div><div class="record-view-item"><small>Mã tài khoản</small><strong>${esc(s.userId||'-')}</strong></div></div>`,`<button class="btn" data-action="close-modal">Đóng</button>`,'small');
}
function showEl(id){document.getElementById(id)?.classList.remove('hidden');}function hideEl(id){document.getElementById(id)?.classList.add('hidden');}function setText(id,v){const el=document.getElementById(id);if(el)el.textContent=String(v??'');}
function esc(v){return String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));}function att(v){return esc(v).replace(/`/g,'&#96;');}function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d').trim();}
function money(v){let n=Number(v||0);return isFinite(n)?new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(n):'-';}function pct(v){return Math.max(0,Math.min(100,Number(v||0)));}
function parseDate(v){if(!v)return null;if(v instanceof Date)return v;let a=String(v).trim(),m;if((m=a.match(/^(\d{4})-(\d{2})-(\d{2})/)))return new Date(+m[1],+m[2]-1,+m[3]);if((m=a.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)))return new Date(+m[3],+m[2]-1,+m[1]);return null;}
function displayDate(v){const d=parseDate(v);if(!d||isNaN(d))return esc(v||'-');return [d.getDate(),d.getMonth()+1].map(n=>String(n).padStart(2,'0')).join('/')+'/'+d.getFullYear();}
function dateTimeInput(v){if(!v)return '';const x=String(v).trim();if(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(x))return x;const m=x.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);return m?`${m[3]}-${m[2]}-${m[1]}T${m[4]}:${m[5]}`:'';}
function dateInput(v){const d=parseDate(v);return d&&!isNaN(d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';}
function phone(v){let s=String(v??'').replace(/\D/g,'');if(s.startsWith('84')&&s.length>=11)s='0'+s.slice(2);if(s.length===9)s='0'+s;return s;}
function selectPeriod(k,repaint=true){let d=new Date(),y=d.getFullYear(),m=d.getMonth(),from,to,label='Tháng này';if(k==='this-month'){from=new Date(y,m,1);to=new Date(y,m+1,0);}if(k==='last-month'){from=new Date(y,m-1,1);to=new Date(y,m,0);label='Tháng trước';}if(k==='this-quarter'){let q=Math.floor(m/3)*3;from=new Date(y,q,1);to=new Date(y,q+3,0);label='Quý này';}if(k==='this-year'){from=new Date(y,0,1);to=new Date(y,11,31);label='Năm nay';}
  APP.state.period={key:k,from,to,label};setText('period-label',label);if(repaint)renderPage();}
function withinPeriod(v){const d=parseDate(v),p=APP.state.period;return d&&p.from&&p.to?d>=p.from&&d<=p.to:false;}
function today(){let d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate());}
function dueTasks(){return dataOf('tasks').filter(r=>!['Hoàn thành','Đã hủy'].includes(r['Trạng thái'])&&parseDate(r['Ngày hạn'])&&parseDate(r['Ngày hạn'])<today());}
function soonTasks(){const t=today(),w=new Date(+t+7*86400000);return dataOf('tasks').filter(r=>!['Hoàn thành','Đã hủy'].includes(r['Trạng thái'])&&parseDate(r['Ngày hạn'])&&parseDate(r['Ngày hạn'])>=t&&parseDate(r['Ngày hạn'])<=w);}
function dataOf(key){return APP.data.modules?.[key]||[];}function cfgOf(k){return APP.data.schema?.[k]||{};}
function htmlEl(id,s){const e=document.getElementById(id);if(e)e.innerHTML=s;}
function toast(title,message,type='success',time=4000){const id='toast-'+Date.now()+'-'+Math.random().toString(36).slice(2),t=document.createElement('div');t.className='toast '+type;t.id=id;const icon={success:'check_circle',error:'error',processing:'sync',warning:'warning'}[type]||'info';t.innerHTML=`<div class="toast-icon"><span class="material-symbols-rounded">${icon}</span></div><div class="toast-copy"><strong>${esc(title)}</strong><p>${esc(message||'')}</p></div><button type="button" class="toast-close" aria-label="Đóng">×</button>`;t.querySelector('.toast-close').onclick=()=>t.remove();document.getElementById('toast-container').appendChild(t);if(time)setTimeout(()=>t.remove(),time);return id;}
function toastUpdate(id,title,msg,type='success',time=4000){const t=document.getElementById(id);if(!t)return toast(title,msg,type,time);t.className='toast '+type;t.querySelector('.toast-icon span').textContent=({success:'check_circle',error:'error',processing:'sync',warning:'warning'}[type]||'info');t.querySelector('.toast-copy').innerHTML=`<strong>${esc(title)}</strong><p>${esc(msg||'')}</p>`;if(time)setTimeout(()=>t.remove(),time);}
function modal(title,desc,body,footer,size='wide'){htmlEl('modal-root',`<div class="modal-overlay"><div class="modal ${size}"><div class="modal-head"><div><h2>${esc(title)}</h2><p>${esc(desc||'')}</p></div><button type="button" class="modal-close" data-action="close-modal" aria-label="Đóng"><span class="material-symbols-rounded">close</span></button></div><div class="modal-body">${body}</div><div class="modal-footer">${footer}</div></div></div>`);}
function closeModal(){if(window.Gallery?.discardForm)window.Gallery.discardForm();htmlEl('modal-root','');APP.state.form=null;APP.state.wizard=null;APP.state.galleryDirty=false;closeCombo();hideTooltip();}
/* V8.8.3: protect unsaved changes without adding asynchronous startup work. */
function hasDirtyDraft(){return Boolean(APP.state.form?.dirty||APP.state.wizard?.dirty||APP.state.v85Document?.dirty||APP.state.galleryDirty);}
function requestDiscardDraft(done){if(APP.state.wizard?.saving||APP.state.v85Document?.saving||window.Gallery?.isUploading?.()){toast('Đang lưu dữ liệu','Vui lòng chờ thao tác ghi kết thúc.','warning');return;}
 if(!hasDirtyDraft())return done();
 confirmBox('Dữ liệu chưa lưu','Bạn đã thay đổi thông tin. Bỏ thay đổi và rời biểu mẫu?',done);
}
function returnFromWizard(){const target=APP.state.wizardReturn;APP.state.wizardReturn=null;
 closeModal();if(!target){const y=APP.state.restoreScrollOnClose;if(y!=null){APP.state.restoreScrollOnClose=null;requestAnimationFrame(()=>window.scrollTo(0,y));}return;}
 if(target.mode==='source'&&canRead(target.key)&&dataOf(target.key).some(r=>String(r[cfgOf(target.key).id])===String(target.id))){
  setPage(target.key,{force:true});APP.state.restoreScrollOnClose=target.scrollY||0;viewRecord(target.key,target.id);
 }else if(APP.state.page===target.listKey){renderPage();}else if(target.listKey){setPage(target.listKey,{force:true});}
}
function requestCloseModal(){requestDiscardDraft(()=>{if(APP.state.wizardReturn)return returnFromWizard();APP.state.v85Document=null;APP.state.detailHistory=[];APP.state.activeDetail=null;closeModal();const y=APP.state.restoreScrollOnClose;if(y!=null){APP.state.restoreScrollOnClose=null;requestAnimationFrame(()=>window.scrollTo(0,y));}});}
function closeConfirm(){htmlEl('confirm-root','');}
function confirmBox(title,msg,fn){htmlEl('confirm-root',`<div class="confirm-overlay"><div class="confirm-box"><div class="confirm-icon"><span class="material-symbols-rounded">warning</span></div><h3>${esc(title)}</h3><p>${esc(msg)}</p><div class="confirm-actions"><button class="btn" data-action="close-confirm">Hủy</button><button class="btn btn-danger" id="confirm-accept">Xác nhận</button></div></div></div>`);document.getElementById('confirm-accept').onclick=async()=>{closeConfirm();await fn();};}
function busy(btn,b){if(!btn)return;if(b){btn.dataset.old=btn.innerHTML;btn.disabled=true;btn.textContent='Đang lưu...';}else{btn.disabled=false;btn.innerHTML=btn.dataset.old||'Lưu';}}
function badge(status){const c=STATUS_COLOR[status]||'gray';return `<span class="badge badge-${c}">${esc(status||'Chưa xác định')}</span>`;}
function icon(name){return `<span class="material-symbols-rounded">${name}</span>`;}
function head(title,description,actions=''){return `<div class="page-head"><div><h1>${esc(title)}</h1><p>${esc(description||'')}</p></div><div class="page-actions">${actions}</div></div>`;}
function empty(title,desc=''){return `<div class="empty-state">${icon('inbox')}<strong>${esc(title)}</strong><p>${esc(desc)}</p></div>`;}
function initLightTheme(){safeStoreRemove('chua_v8_theme');document.documentElement.removeAttribute('data-theme');document.documentElement.style.colorScheme='light';}
function switchMobile(force){const s=document.getElementById('sidebar'),o=document.getElementById('mobile-sidebar-overlay');if(window.innerWidth>1050){s.classList.toggle('collapsed');return;}const b=force===undefined?!s.classList.contains('mobile-open'):force;s.classList.toggle('mobile-open',b);o.classList.toggle('show',b);}
function setPage(page,options={}){if(window.Gallery?.isUploading?.())return toast('Đang tải file','Vui lòng hoàn tất việc tải file trước khi chuyển phân hệ.','warning');if(!options.force&&hasDirtyDraft())return requestDiscardDraft(()=>setPage(page,{force:true}));
 if(APP.state.page==='gallery'&&page!=='gallery')window.Gallery?.closeImage();
 if(APP.state.linkedContext&&page!==APP.state.linkedContext.childKey)window.chuaV85.clearLinkedContext();
 if(!canPage(page))page='dashboard';if(APP.state.page==='reports'&&page!=='reports'&&typeof reportCharts!=='undefined'){reportCharts.forEach(c=>{try{c.destroy();}catch(e){}});reportCharts=[];}if(!['dashboard','action-center','categories','reports','emailCenter','gallery'].includes(page)&&!APP.data.schema[page])page='dashboard';APP.state.page=page;document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.page===page));let cfg=cfgOf(page),title=page==='gallery'?'Thư viện & Kỷ yếu':page==='emailCenter'?'Quản lý Email nhắc việc':page==='dashboard'?'Trung tâm điều hành':page==='action-center'?'Việc cần xử lý':page==='categories'?'Danh mục':page==='reports'?'Báo cáo tổng hợp':cfg.title;
  setText('topbar-title',title);setText('topbar-subtitle',PAGE_DESC[page]||'Theo dõi hoạt động nhà chùa');setText('topbar-icon',PAGE_ICON[page]||cfg.icon||'dashboard');closeModal();APP.state.activeDetail=null;APP.state.detailHistory=[];APP.state.wizardReturn=null;closePreview();hideEl('period-menu');hideEl('notification-popover');closeCombo();renderPage();if(window.innerWidth<=1050)switchMobile(false);}
function renderPage(){if(APP.state.page==='gallery')return window.Gallery?.show();if(APP.state.page==='emailCenter')return window.EmailCenter?.render();if(APP.state.page==='dashboard')return renderDashboard();if(APP.state.page==='action-center')return renderActionCenter();if(APP.state.page==='categories')return renderCategories();if(APP.state.page==='reports')return renderReports();return renderModule(APP.state.page);}
function toggleMenu(id,anchor){const el=document.getElementById(id);if(!el)return;const show=el.classList.contains('hidden');['period-menu','notification-popover','user-dropdown'].forEach(k=>{if(k!==id)hideEl(k);});el.classList.toggle('hidden',!show);if(show){const r=anchor.getBoundingClientRect();el.style.position='fixed';el.style.top=(r.bottom+5)+'px';el.style.left='auto';el.style.right=Math.max(7,window.innerWidth-r.right)+'px';}}
function notifications(){const over=dueTasks(),soon=soonTasks();setText('notification-count',over.length+soon.length);setText('nav-action-count',over.length+soon.length);}
function toggleNotifications(anchor){
  const panel=document.getElementById('notification-popover');
  if(!panel)return;
  if(!panel.classList.contains('hidden')){hideEl('notification-popover');return;}
  if(!canRead('tasks')){
    htmlEl('notification-popover',`<div class="nc-head"><div><strong>Thông báo công việc</strong><small>Bạn chưa có quyền xem công việc</small></div></div>`);
    toggleMenu('notification-popover',anchor);return;
  }
  const late=dueTasks().slice().sort((a,b)=>(parseDate(a['Ngày hạn'])||0)-(parseDate(b['Ngày hạn'])||0));
  const soon=soonTasks().slice().sort((a,b)=>(parseDate(a['Ngày hạn'])||0)-(parseDate(b['Ngày hạn'])||0));
  const total=late.length+soon.length;
  const tasks=[...late.map(r=>({row:r,type:'late'})),...soon.map(r=>({row:r,type:'soon'}))].slice(0,8);
  const entries=tasks.map(({row,type})=>{
    const id=String(row['Mã công việc']||'');
    const label=String(row['Tiêu đề']||'Công việc chưa có tiêu đề');
    const owner=lookup('employees',row['Mã nhân sự phụ trách']);
    const state=type==='late'?'Quá hạn':'Đến hạn trong 7 ngày';
    return `<button class="nc-item" type="button" data-action="view-row" data-module="tasks" data-id="${att(id)}" title="${att(label)}">
      <span class="nc-symbol ${type}">${icon(type==='late'?'priority_high':'hourglass_top')}</span>
      <span class="nc-copy"><strong>${esc(label)}</strong><small>${esc(id)} · ${displayDate(row['Ngày hạn'])}${owner&&owner!=='-'?' · '+esc(owner):''}</small><em class="nc-status ${type}">${state}</em></span>
      <span class="nc-chevron">${icon('chevron_right')}</span>
    </button>`;
  }).join('');
  const body=tasks.length?entries:`<div class="nc-empty">${icon('notifications_off')}<strong>Không có việc cần nhắc</strong><small>Hiện chưa có công việc quá hạn hoặc sắp đến hạn.</small></div>`;
  htmlEl('notification-popover',`<div class="nc-head"><div><strong>${icon('notifications_active')} Thông báo công việc</strong><small>Nhắc việc dựa trên hạn và trạng thái hiện tại</small></div><b>${total}</b></div>
    <div class="nc-stats"><span class="late">${late.length} quá hạn</span><span class="soon">${soon.length} sắp đến hạn</span></div>
    <div class="nc-list">${body}</div>
    <div class="nc-footer"><button type="button" data-page="action-center">${icon('list_alt')} Xem tất cả công việc ${icon('arrow_forward')}</button></div>`);
  toggleMenu('notification-popover',anchor);
  const r=anchor.getBoundingClientRect();
  panel.style.right=Math.max(8,Math.min(window.innerWidth-20,window.innerWidth-r.right))+'px';
  panel.style.top=Math.min(window.innerHeight-90,r.bottom+8)+'px';
}

/* -------- Dashboard / trung tâm nhắc việc -------- */
function dashboardKpi(label,val,description,color,symbol){return `<div class="panel kpi-card"><span class="kpi-stripe" style="background:var(--${color})"></span><div class="kpi-main"><div class="kpi-icon ${color}">${icon(symbol)}</div><div><div class="kpi-label">${label}</div><div class="kpi-value">${val}</div><div class="kpi-trend">${description}</div></div></div></div>`;}
function renderDashboard(){const active=(dataOf('people')||[]).filter(r=>r['Trạng thái']!=='Tạm ngừng'),fees=dataOf('fees'),due=dueTasks(),soon=soonTasks(),activities=dataOf('sessions').filter(x=>withinPeriod(x['Ngày sinh hoạt'])),thisEvents=dataOf('events').filter(x=>withinPeriod(x['Ngày dương lịch'])),created=dataOf('intakes').filter(x=>withinPeriod(x['Ngày tiếp nhận']));
  const feeTotal=fees.reduce((a,r)=>a+Number(r['Phải thu']||0),0),pctAtt=dataOf('attendance').filter(x=>x['Trạng thái điểm danh']==='Có mặt').length;
  const tasks=dataOf('tasks').slice().sort((a,b)=>(parseDate(b['Ngày giao'])||0)-(parseDate(a['Ngày giao'])||0)).slice(0,7);
  htmlEl('page-content',`<div class="page-shell">${head('Trung tâm điều hành','Tổng hợp dữ liệu thật từ Database V8; số liệu thời gian áp dụng theo kỳ đang xem.')}
    <div class="operation-banner">${icon('info')} Phiên đã đăng nhập; dữ liệu được giới hạn theo quyền người dùng. Giao diện chỉ dùng dữ liệu đã preload; bấm Làm mới để đồng bộ toàn hệ thống.</div>
    <div class="kpi-grid">${canRead('people')?dashboardKpi('Phật tử / người tham gia',active.length,'Hồ sơ đang hoạt động','blue','diversity_3'):''}${dashboardKpi('Nhóm lớp',dataOf('classes').length,'Đang khai báo','violet','school')}${dashboardKpi('Buổi sinh hoạt',activities.length,'Trong kỳ đang xem','green','event_note')}${dashboardKpi('Sự kiện',thisEvents.length,'Trong kỳ đang xem','orange','event')}${canRead('tasks')?dashboardKpi('Công việc quá hạn',due.length,'Chưa hoàn thành','red','schedule'):''}${canRead('tasks')?dashboardKpi('Đến hạn trong 7 ngày',soon.length,'Cần theo dõi','orange','hourglass_top'):''}${canRead('intakes')?dashboardKpi('Tiếp nhận',created.length,'Yêu cầu trong kỳ','blue','support_agent'):''}${canRead('fees')?dashboardKpi('Khoản phải thu',money(feeTotal),'Tổng phải thu đã ghi nhận (VND)','green','payments'):''}${canRead('finance')?dashboardKpi('Tổng thu đã xác nhận',money(dataOf('finance').filter(r=>r['Loại giao dịch']==='Thu'&&isPosted(r)).reduce((s,r)=>s+Number(r['Số tiền']||0),0)),'Theo chứng từ tài chính','green','trending_up'):''}${canRead('finance')?dashboardKpi('Tổng chi đã xác nhận',money(dataOf('finance').filter(r=>r['Loại giao dịch']==='Chi'&&isPosted(r)).reduce((s,r)=>s+Number(r['Số tiền']||0),0)),'Theo chứng từ tài chính','red','trending_down'):''}${canRead('products')?dashboardKpi('SKU',dataOf('products').length,'Mã sản phẩm trong hệ thống','blue','inventory_2'):''}${canRead('orders')?dashboardKpi('Đơn bán',dataOf('orders').length,'Số đơn đã ghi nhận','violet','shopping_bag'):''}</div>
    <div class="dashboard-grid">
      <div class="panel chart-card"><div class="section-title-row"><h2>Công việc cần chú ý</h2><button class="btn btn-sm" data-page="action-center">Xem tất cả</button></div>${alertRows(due,soon)}</div>
      <div class="panel chart-card"><div class="section-title-row"><h2>Hoạt động & học tập</h2><small>Số lượng đang ghi nhận</small></div><div class="module-summary" style="grid-template-columns:1fr 1fr;margin-top:12px"><div class="panel"><small>Thành viên lớp</small><strong>${dataOf('memberships').length}</strong></div><div class="panel"><small>Lượt có mặt</small><strong>${pctAtt}</strong></div><div class="panel"><small>Kỳ thi</small><strong>${dataOf('exams').length}</strong></div><div class="panel"><small>Kết quả thi</small><strong>${dataOf('results').length}</strong></div></div></div>
      <div class="panel chart-card"><div class="section-title-row"><h2>Nhà Linh</h2><button class="btn btn-sm" data-page="memorials">Hồ sơ</button></div><div class="module-summary" style="grid-template-columns:1fr;margin-top:12px"><div class="panel"><small>Hồ sơ quản lý</small><strong>${dataOf('memorials').length}</strong></div><div class="panel"><small>Vị trí Nhà Linh</small><strong>${dataOf('slots').length}</strong></div></div></div>
    </div>
    <div class="panel table-panel"><div class="section-title-row" style="padding:15px 15px 0"><h2>Công việc gần đây</h2><button class="btn btn-sm" data-page="tasks">Xem công việc</button></div>${tasks.length?`<div class="data-table-wrap"><table class="dashboard-mini-table"><thead><tr><th>Mã</th><th>Công việc</th><th>Hạn</th><th>Người phụ trách</th><th>Trạng thái</th></tr></thead><tbody>${tasks.map(r=>`<tr><td>${esc(r['Mã công việc'])}</td><td>${esc(r['Tiêu đề'])}</td><td>${displayDate(r['Ngày hạn'])}</td><td>${esc(lookup('employees',r['Mã nhân sự phụ trách']))}</td><td>${badge(r['Trạng thái'])}</td></tr>`).join('')}</tbody></table></div>`:empty('Chưa có công việc','Tạo công việc tại menu Công việc.')}</div></div>`);
  notifications();
}
function alertRows(over,soon){const items=[['priority_high','Quá hạn',over.length,'red'],['hourglass_top','Sắp đến hạn',soon.length,'orange'],['check_circle','Hoàn thành',dataOf('tasks').filter(r=>r['Trạng thái']==='Hoàn thành').length,'green']];return `<div class="alert-list">${items.map(x=>`<div class="alert-row"><span class="alert-icon ${x[3]==='orange'?'orange':'blue'}">${icon(x[0])}</span><span class="alert-copy"><strong>${x[1]}</strong><small>Công việc cần theo dõi</small></span><b>${x[2]}</b>${icon('chevron_right')}</div>`).join('')}</div>`;}
function renderActionCenter(){const over=dueTasks(),soon=soonTasks(),wait=dataOf('tasks').filter(x=>x['Trạng thái']==='Chờ xác nhận');htmlEl('page-content',`<div class="page-shell">${head('Việc cần xử lý','Cảnh báo dựa trên ngày hạn và trạng thái công việc.')}
  <div class="action-columns">${[['Quá hạn',over,'error'],['Sắp đến hạn 7 ngày',soon,'hourglass_top'],['Chờ xác nhận',wait,'pending_actions']].map(([title,rows,symbol])=>`<section class="panel section-card"><div class="section-title-row"><h2>${title}</h2>${badge(String(rows.length))}</div>${rows.length?`<div class="alert-list">${rows.slice(0,20).map(r=>`<button class="notification-item" data-action="view-row" data-module="tasks" data-id="${att(r['Mã công việc'])}">${icon(symbol)}<span><strong>${esc(r['Tiêu đề'])}</strong><small>${esc(r['Mã công việc'])} · ${displayDate(r['Ngày hạn'])}</small></span></button>`).join('')}</div>`:empty('Không có công việc','Không có mục nào trong nhóm này.')}</section>`).join('')}</div></div>`);notifications();}

/* -------- Danh sách module: filter, sort, pagination client-side -------- */
function filteredRows(key){let rows=dataOf(key).slice(),s=APP.state.search[key]||'',f=APP.state.filters[key]||{};
  if(s){const q=norm(s);rows=rows.filter(r=>Object.values(r).some(v=>norm(v).includes(q)));}Object.entries(f).forEach(([field,val])=>{if(val)rows=rows.filter(r=>String(r[field]||'')===String(val));});
  let cfg=cfgOf(key),fld=(cfg.dates||[]).filter(x=>/Ngày/.test(x))[0]||cfg.id,asc=APP.state.sort[key]==='oldest';rows.sort((a,b)=>{let av=String(a[fld]??''),bv=String(b[fld]??'');if((cfg.dates||[]).includes(fld))return ((parseDate(av)?.getTime()||0)-(parseDate(bv)?.getTime()||0))*(asc?1:-1);return av.localeCompare(bv,'vi',{numeric:true})*(asc?1:-1);});return rows;}
function pageN(key,total){const pages=Math.max(1,Math.ceil(total/(APP.state.pageSize[key]||12)));APP.state.pageNo[key]=Math.min(Math.max(1,APP.state.pageNo[key]||1),pages);return APP.state.pageNo[key];}
function tableFields(key){const cfg=cfgOf(key),all=(cfg.fields||[]).filter(f=>!(key==='users'&&f==='Mật khẩu')),id=cfg.id,prior=[id,...(cfg.required||[]),...(cfg.dates||[]),'Trạng thái','Trạng thái điểm danh','Tiến độ','Phải thu'];let out=[...new Set(prior.filter(f=>all.includes(f)))];all.forEach(f=>{if(out.length<8&&!out.includes(f)&&!(cfg.system||[]).includes(f))out.push(f);});return out.slice(0,8);}
function quickOptions(key,field){const cfg=cfgOf(key);if(cfg.cats?.[field])return APP.data.categories[cfg.cats[field]]||[];if(cfg.refs?.[field])return dataOf(cfg.refs[field]).map(x=>x[cfgOf(cfg.refs[field]).id]).filter(Boolean);if(field==='Trạng thái'&&MODULE_STATE[key])return MODULE_STATE[key];return APP.data.fixedOptions[field]||[];}
function toolbar(key){const cfg=cfgOf(key),filterField=cfg.fields.includes('Trạng thái')?'Trạng thái':cfg.fields.includes('Trạng thái điểm danh')?'Trạng thái điểm danh':null,options=filterField?quickOptions(key,filterField):[];return `<div class="panel module-toolbar"><div class="toolbar-left"><label class="search-box">${icon('search')}<input data-search="${key}" value="${att(APP.state.search[key]||'')}" placeholder="Tìm mã, tên hoặc thông tin..."></label></div><div class="toolbar-right">${filterField?comboMarkup('filter',APP.state.filters[key]?.[filterField]||'',[{value:'',label:'Tất cả trạng thái'},...options.map(v=>({value:v,label:v}))],{module:key,filter:filterField}):''}${comboMarkup('sort',APP.state.sort[key]||'newest',[{value:'newest',label:'Mới nhất'},{value:'oldest',label:'Cũ nhất'}],{module:key})}${comboMarkup('size',String(APP.state.pageSize[key]||12),[12,20,50].map(v=>({value:String(v),label:v+' dòng'})),{module:key})}</div></div>`;}
function moduleRowActions(key,r){
  const cfg=cfgOf(key),id=att(r[cfg.id]);
  let actions=`<button class="row-action" title="Xem" data-action="view-row" data-module="${key}" data-id="${id}">${icon('visibility')}</button>`;
  if(key==='files'){
    actions+=`<button class="row-action" title="Xem file" data-action="view-file" data-id="${id}">${icon('visibility')}</button>`;
    if(APP.permissions.canDeleteFile)actions+=`<button class="row-action danger" title="Xóa file Drive" data-action="delete-file" data-id="${id}">${icon('delete')}</button>`;
  }else{
    if(!cfg.readOnly&&canWrite(key)){
      if(key!=='users')actions+=`<button class="row-action" title="Đính kèm file" data-action="attach-row" data-module="${key}" data-id="${id}">${icon('attach_file')}</button>`;
      if(key!=='finance'||r['Nguồn phát sinh']==='Thủ công'){
        actions+=`<button class="row-action" title="Sửa" data-action="edit-row" data-module="${key}" data-id="${id}">${icon('edit')}</button>`;
        if(canDelete(key))actions+=`<button class="row-action danger" title="Xóa" data-action="delete-row" data-module="${key}" data-id="${id}">${icon('delete')}</button>`;
      }
    }
  }
  if(window.chuaV85?.hasLinks?.(key))actions+=`<button class="row-action" title="Liên kết và thao tác nhanh" data-v85-panel="${att(key)}" data-id="${id}">${icon('account_tree')}</button>`;
  return actions;
}
function renderModule(key){
  if(!canRead(key))return setPage('dashboard');
  const cfg=cfgOf(key),rows=filteredRows(key),total=rows.length,ps=APP.state.pageSize[key]||12,p=pageN(key,total),chunk=rows.slice((p-1)*ps,p*ps),fields=tableFields(key);
  let actions='';
  if(canWrite(key)&&!cfg.readOnly){
    actions+=`<button class="btn btn-primary" data-action="new-row" data-module="${key}">${icon('add_circle')} Thêm mới</button>`;
    if(key!=='users'&&!BLOCKED_TRANSACTION_KEYS.has(key))actions+=`<button class="btn" data-action="open-import" data-module="${key}">${icon('upload_file')} Import</button>`;
  }
  if(key!=='users')actions+=`<button class="btn" data-action="export-xlsx" data-module="${key}">${icon('download')} Export XLSX</button>`;
  if(key==='files'&&APP.permissions.canUpload)actions+=`<button class="btn btn-primary" data-action="upload-file">${icon('cloud_upload')} Tải tài liệu</button>`;
  if(key==='emails'&&APP.permissions.canSendEmails)actions+=`<button class="btn btn-primary" data-page="emailCenter">${icon('mail')} Quản lý Email nhắc việc</button>`;
  const hint=['files','emails','audit'].includes(key)&&APP.deferredStatus!=='done'?('Dữ liệu lịch sử tải riêng: '+(APP.deferredStatus==='error'?'tải chưa thành công. Hãy bấm Làm mới.':'đang đồng bộ ở nền.')):
    (cfg.readOnly?'Lịch sử chỉ xem, không chỉnh trực tiếp.':'Các thao tác Lưu / Xóa được ghi trực tiếp vào Google Sheet.');
  const table=chunk.length?`<div class="data-table-wrap"><table class="data-table module-table"><thead><tr><th>Thao tác</th>${fields.map(field=>`<th>${esc(field)} ${renderInfo(key,field)}</th>`).join('')}</tr></thead><tbody>${chunk.map(r=>`<tr><td><div class="row-actions">${moduleRowActions(key,r)}</div></td>${fields.map((field,i)=>`<td>${cellView(key,field,r[field],i===0)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:
    empty('Không có dữ liệu phù hợp','Tạo bản ghi hoặc đổi điều kiện tìm kiếm.');
  const pages=Math.max(1,Math.ceil(total/ps));
  htmlEl('page-content',`<div class="page-shell">${head(cfg.title,PAGE_DESC[key],actions)}
    <div class="operation-banner">${icon('info')} Tab <b>${esc(cfg.sheet)}</b> (Database V8). ${esc(hint)}</div>
    <div class="module-summary"><div class="panel"><small>Tổng bản ghi</small><strong>${dataOf(key).length}</strong></div><div class="panel"><small>Theo bộ lọc</small><strong>${total}</strong></div><div class="panel"><small>Trang đang xem</small><strong>${p}</strong></div><div class="panel"><small>Số dòng / trang</small><strong>${ps}</strong></div></div>
    ${toolbar(key)}<div class="panel table-panel">${table}
    <div class="table-footer"><span>Hiển thị ${total?(p-1)*ps+1:0}-${Math.min(p*ps,total)} / ${total}</span><div class="pagination"><button data-nav="${key}" data-p="${p-1}" ${p<=1?'disabled':''}>‹</button>${Array.from({length:Math.min(5,pages)},(_,i)=>Math.max(1,Math.min(p-2,Math.max(1,pages-4)))+i).map(n=>`<button class="${n===p?'active':''}" data-nav="${key}" data-p="${n}">${n}</button>`).join('')}<button data-nav="${key}" data-p="${p+1}" ${p>=pages?'disabled':''}>›</button></div></div></div></div>`);
}
function cellView(key,field,value,primary){const cfg=cfgOf(key);if(field==='Trạng thái'||field==='Trạng thái điểm danh'||field==='Kết quả'&&!primary)return badge(value);let text='';if((cfg.refs||{})[field])text=lookup(cfg.refs[field],value);else if((cfg.dates||[]).includes(field))text=displayDate(value);else if((cfg.numbers||[]).includes(field))text=money(value);else if((cfg.phone||[]).includes(field))text=phone(value);else text=String(value||'-');return `<span class="${primary?'record-primary':''}">${esc(text)}</span>${cfg.refs?.[field]&&value?`<small class="record-secondary">${esc(value)}</small>`:''}`;}
function lookup(key,id){if(!id)return '-';const cfg=cfgOf(key),obj=dataOf(key).find(x=>String(x[cfg.id])===String(id));return obj?obj[REF_NAME[key]||cfg.required?.[0]||cfg.id]||id:id;}

/* -------- Danh mục cột B3 theo từng nhóm -------- */
function renderCategories(){const data=APP.data.categories||{},groups=Object.keys(data),sel=APP.state.categoryGroup||groups[0],values=data[sel]||[];APP.state.categoryGroup=sel;
  htmlEl('page-content',`<div class="page-shell">${head('Danh mục','Danh sách tham chiếu thực tế theo từng cột trong tab Danh mục.',`${APP.permissions.canManageCategories?`<button class="btn btn-primary" data-action="new-category">${icon('add')} Thêm giá trị</button>`:''}`)}
  <div class="operation-banner">${icon('info')} Trạng thái và các lựa chọn cố định được hardcode trong mã. Những nhóm danh mục nghiệp vụ có thể chỉnh trong tab này.</div>
  <div class="panel module-toolbar"><div class="toolbar-left">${comboMarkup('catgroup',sel,groups.map(g=>({value:g,label:g})),{})}</div><div class="toolbar-right"><strong>${values.length} giá trị</strong></div></div>
  <div class="panel table-panel"><div class="data-table-wrap"><table class="data-table" style="min-width:550px"><thead><tr><th style="width:125px">Thao tác</th><th>Nhóm danh mục</th><th>Giá trị</th></tr></thead><tbody>${values.map(v=>`<tr><td><div class="row-actions">${APP.permissions.canManageCategories?`<button class="row-action" data-action="edit-category" data-value="${att(v)}">${icon('edit')}</button><button class="row-action danger" data-action="delete-category" data-value="${att(v)}">${icon('delete')}</button>`:''}</div></td><td>${esc(sel)}</td><td class="main-cell"><strong>${esc(v)}</strong></td></tr>`).join('')}</tbody></table></div></div></div>`);}
/* Danh mục batch thuộc phần tính năng CRUD độc lập; tải ở script kế tiếp. */
/* -------- Form CRUD: giữ modal, field hint, combobox search -------- */
function optionsForField(key,field){const cfg=cfgOf(key);if(cfg.refs?.[field]){const name=cfg.refs[field],r=cfgOf(name);return dataOf(name).map(x=>({value:String(x[r.id]||''),label:`${x[r.id]} · ${x[REF_NAME[name]||r.required?.[0]||r.id]||x[r.id]}${name==='products'?' · Size '+String(x['Size']||'') :''}`})).filter(o=>o.value);}
  if(cfg.cats?.[field])return (APP.data.categories[cfg.cats[field]]||[]).map(x=>({value:x,label:x}));
  if(key==='users'&&field==='Vai trò')return ['Admin','Quản lý','Nhân sự','Phụ huynh','Viewer'].map(v=>({value:v,label:v}));const statuses=field==='Trạng thái'?MODULE_STATE[key]:null;const direct=statuses||APP.data.fixedOptions[field];if(direct)return direct.map(x=>({value:x,label:x}));return null;}
function fieldHint(key,field){const c=cfgOf(key);if(c.refs?.[field])return 'Chọn mã liên kết từ hồ sơ đã tạo trước đó. Dùng tìm kiếm không dấu để chọn nhanh.';if(c.cats?.[field])return 'Lấy từ '+c.cats[field]+' trong tab Danh mục.';if((c.dates||[]).includes(field))return 'Chọn ngày theo định dạng dd/mm/yyyy.';if((c.periods||[]).includes(field))return 'Nhập kỳ theo định dạng mm/yyyy, ví dụ 10/2026.';if((c.numbers||[]).includes(field))return 'Nhập số không âm. Tiền tệ tự định dạng dấu phân cách hàng nghìn.';if((c.phone||[]).includes(field))return 'Giữ nguyên số 0 đầu của số điện thoại.';if(/Trạng thái|Mức ưu tiên|Kết quả/.test(field))return 'Dùng để lọc, theo dõi tiến độ và báo cáo.';if(/Địa chỉ|Nội dung|Ghi chú|Nhận xét|Thành tích/.test(field))return 'Nhập thông tin mô tả bổ sung nếu cần.';return 'Thông tin này được ghi vào '+c.sheet+' trong Google Sheet.';}
function renderInfo(key,field){return `<button class="info-icon" type="button" data-tooltip="${att(fieldHint(key,field))}" aria-label="Gợi ý ${att(field)}">${icon('info')}</button>`;}
function rawMoney(v){return String(v??'').replace(/\./g,'').replace(/,/g,'.').replace(/[^0-9.]/g,'');}
function fieldInput(key,field,value='',attrs={}){const ctx=(attrs.part==='grid'?APP.state.wizard?.context:APP.state.form?.context);if(ctx&&ctx.childKey===key&&ctx.foreignKey===field)return `<div class="form-field v883-locked-reference"><label>${esc(field)} ${icon('lock')}</label><div class="v883-fixed-value">${icon('link')} <strong>${esc(ctx.sourceName||ctx.sourceId)}</strong><small>${esc(ctx.sourceId)}</small></div><div class="field-help">Liên kết từ hồ sơ nguồn; không thể thay đổi tại đây.</div></div>`;
 const cfg=cfgOf(key),required=(cfg.required||[]).includes(field),locked=(cfg.computed||[]).includes(field)||(cfg.system||[]).includes(field),opts=optionsForField(key,field),part=attrs.part||'single',index=attrs.index??-1,extra=`data-form-field="${att(field)}" data-form-module="${att(key)}" data-form-part="${part}" data-rowindex="${index}"`,placeholder='Nhập '+field.toLowerCase()+'...';let control='';
  if(opts){const selected=window.chuaV85?.dependentOptions?.(key,field,opts,part,index)||opts;const list=[{value:'',label:'Chọn '+field},...selected];control=comboMarkup('data',value,list,{module:key,field,part,index});}
  else if(key==='users'&&field==='Mật khẩu')control=`<input type="password" ${extra} value="" placeholder="${value?'Để trống để giữ mật khẩu cũ':'Đặt mật khẩu mới; để trống khi sửa'}" autocomplete="new-password">`;
  else if((cfg.dateTimes||[]).includes(field))control=`<input type="datetime-local" ${extra} value="${att(dateTimeInput(value))}" placeholder="Chọn ngày giờ">`;
  else if((cfg.dates||[]).includes(field))control=`<input type="date" ${extra} value="${att(dateInput(value))}" ${locked?'readonly class="field-locked"':''} placeholder="Chọn ngày">`;
  else if((cfg.periods||[]).includes(field))control=`<input type="text" ${extra} value="${att(value)}" placeholder="mm/yyyy" maxlength="7" ${locked?'readonly class="field-locked"':''}>`;
  else if((cfg.numbers||[]).includes(field))control=`<input class="currency-input ${locked?'field-locked':''}" type="text" inputmode="decimal" ${extra} value="${att(value===''?'':money(value))}" placeholder="${locked?'Tự tính':'Nhập số'}" ${locked?'readonly':''}>`;
  else if((cfg.phone||[]).includes(field))control=`<input type="tel" inputmode="tel" ${extra} value="${att(phone(value))}" placeholder="0xxxxxxxxx" ${locked?'readonly':''}>`;
  else if(/Email/.test(field))control=`<input type="email" ${extra} value="${att(value)}" placeholder="ten@example.com" ${locked?'readonly':''}>`;
  else if(/Nội dung|Địa chỉ|Ghi chú|Nhận xét|Lịch sinh hoạt|Thành tích|Phản hồi|Kết quả xử lý/.test(field))control=`<textarea ${extra} ${locked?'readonly':''} placeholder="${att(placeholder)}">${esc(value)}</textarea>`;
  else control=`<input type="text" ${extra} value="${att(value)}" ${locked?'readonly class="field-locked"':''} placeholder="${locked?'Tự điền theo hệ thống':att(placeholder)}">`;
  return `<div class="form-field"><label>${esc(field)}${required?' <span class="required">*</span>':''} ${renderInfo(key,field)}</label>${control}<div class="field-help">${esc(fieldHint(key,field))}</div></div>`;}
function editableFields(key){const cfg=cfgOf(key);return cfg.fields.filter(f=>f!==cfg.id&&f!=='Ảnh File ID'&&!(cfg.system||[]).includes(f));}
function openForm(key,id=''){const cfg=cfgOf(key);if(cfg.readOnly||!canWrite(key))return;const old=id?dataOf(key).find(x=>String(x[cfg.id])===String(id)):null;if(id&&!old)return toast('Không tìm thấy bản ghi',id,'error');const row=Object.assign({},old||{});if(!old){(cfg.dates||[]).forEach(f=>{if(/Ngày giao|Ngày tham gia|Ngày tiếp nhận|Ngày sinh hoạt|Ngày dương lịch/.test(f))row[f]=displayDate(new Date());});if(cfg.fields.includes('Trạng thái'))row['Trạng thái']=MODULE_STATE[key]?.[0]||'Hoạt động';if(key==='fees'){row['Học phí gốc']=0;row['Miễn giảm']=0;row['Phải thu']=0;}if(key==='tasks')row['Tiến độ']=0;}
  if(key==='users')row['Mật khẩu']='';APP.state.form={mode:'record',key,id,values:row,files:[],dirty:false};const fields=editableFields(key),form=`<div class="module-edit-form"><div class="form-grid">${fields.map(f=>fieldInput(key,f,row[f]??'')).join('')}</div>${window.chuaV86?.singleFileArea?.(key)||''}</div>`;
  modal(id?'Chỉnh sửa '+cfg.title:'Thêm '+cfg.title,`${id?'Mã: '+id:'Mã tự động sinh sau khi lưu'} · Tab ${cfg.sheet}`,form,`<button class="btn" data-action="close-modal">Hủy</button><button id="save-entry" class="btn btn-primary" data-action="save-row">${icon('save')} Lưu dữ liệu</button>`,'xwide');}
function validateClient(key,row){const cfg=cfgOf(key),err=[];
  if(cfg.fields.includes('Email')&&String(row.Email??'').trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.Email).trim()))err.push('Email không đúng định dạng');
  const ctx=APP.state.wizard?.key===key?APP.state.wizard.context:APP.state.form?.key===key?APP.state.form.context:null;
  if(ctx&&String(row[ctx.foreignKey]||'')!==String(ctx.sourceId))err.push('Liên kết '+ctx.foreignKey+' phải là '+ctx.sourceId);
(cfg.required||[]).forEach(f=>{if(!String(row[f]??'').trim())err.push('Thiếu '+f);});(cfg.dates||[]).forEach(f=>{if(row[f]&&!parseDate(row[f]))err.push('Ngày không hợp lệ: '+f);});(cfg.periods||[]).forEach(f=>{if(row[f]&&!/^(0[1-9]|1[0-2])\/\d{4}$/.test(row[f]))err.push('Kỳ phải là mm/yyyy: '+f);});
  if(key==='users'&&!row['Tên đăng nhập'])err.push('Thiếu tên đăng nhập');if(key==='invitations'&&!row['Mã khách']&&!row['Mã hồ sơ Nhà Linh'])err.push('Chọn khách mời hoặc hồ sơ Nhà Linh');if(key==='fees'){if(Number(rawMoney(row['Miễn giảm']))>Number(rawMoney(row['Học phí gốc'])))err.push('Miễn giảm không vượt quá học phí gốc');}
  if(key==='tasks'){let a=parseDate(row['Ngày giao']),b=parseDate(row['Ngày hạn']);if(a&&b&&b<a)err.push('Ngày hạn trước ngày giao');if(Number(row['Tiến độ'])>100)err.push('Tiến độ lớn hơn 100%');}
  return err;}
async function saveForm(){const f=APP.state.form;if(f?.mode!=='record'||f.saving)return;const cfg=cfgOf(f.key),errors=validateClient(f.key,f.values);if(errors.length)return toast('Chưa hợp lệ',errors.join('; '),'error',6000);const btn=document.getElementById('save-entry');f.saving=true;busy(btn,true);const t=toast('Đang lưu','Ghi bản ghi tới Google Sheet.','processing',0);
  try{const attachments=(f.files||[]).slice();const r=await gas('saveRecord',f.key,f.values,{timeout:60000});mergeRow(f.key,r.entry);applyServerPatches(r.patches);closeModal();renderPage();if(attachments.length)scheduleWizardUploads(f.key,[r.entry],[attachments]);toastUpdate(t,r.warning?'Lưu chính thành công, đồng bộ phụ cần kiểm tra':'Lưu thành công',r.warning||`${cfg.title}: ${r.entry[cfg.id]}`,r.warning?'warning':'success',r.warning?10000:4000);}
  catch(e){f.saving=false;toastUpdate(t,'Không thể lưu',e.message,'error',7500);busy(btn,false);}}
function mergeRow(key,row){APP.data.modules[key]??=[];APP.localVersion[key]=(APP.localVersion[key]||0)+1;const cfg=cfgOf(key),rows=dataOf(key),i=rows.findIndex(x=>String(x[cfg.id])===String(row[cfg.id]));if(i>=0)rows[i]=row;else rows.unshift(row);notifications();}
function viewRecord(key,id){const cfg=cfgOf(key),r=dataOf(key).find(x=>String(x[cfg.id])===String(id));if(!r)return toast('Không tìm thấy hồ sơ',id,'error');APP.state.activeDetail={key,id};const content=`<div class="record-view-grid">${cfg.fields.filter(f=>!(key==='users'&&f==='Mật khẩu')).map(f=>`<div class="record-view-item"><small>${esc(f)}</small><strong>${(cfg.refs||{})[f]?`${esc(lookup(cfg.refs[f],r[f]))}<small>(${esc(r[f])})</small>`:(cfg.dates||[]).includes(f)?displayDate(r[f]):(cfg.numbers||[]).includes(f)?money(r[f]):esc(r[f]||'-')}</strong></div>`).join('')}</div>${window.chuaV85?.relatedHtml?.(key,r)||''}`;
  modal('Chi tiết '+cfg.title,`${id} · ${cfg.sheet}`,content,`<button class="btn" data-action="close-modal">Đóng</button>${cfg.readOnly||!canWrite(key)?'':`<button class="btn btn-primary" data-action="edit-row" data-module="${key}" data-id="${att(id)}">${icon('edit')} Chỉnh sửa</button>`}`,'xwide');}
async function removeRecord(key,id){const cfg=cfgOf(key);if(cfg.readOnly||!canDelete(key))return;confirmBox('Xóa '+cfg.title,`Bạn có chắc muốn xóa ${id}? Hệ thống sẽ kiểm tra dữ liệu liên kết trước khi xóa.`,async()=>{const t=toast('Đang xóa','Kiểm tra tham chiếu và Google Sheet...','processing',0);
    try{const response=await gas('deleteRecord',key,id,{timeout:60000});APP.data.modules[key]=dataOf(key).filter(r=>String(r[cfg.id])!==id);applyServerPatches(response.patches);renderPage();toastUpdate(t,response.warning?'Đã xóa, cần kiểm tra đồng bộ':'Xóa thành công',response.warning||id,response.warning?'warning':'success',response.warning?10000:4000);}
    catch(e){toastUpdate(t,'Không thể xóa',e.message,'error',6500);}
  });}

/* Wizard thêm mới được tách compilation unit, không chặn startup. */
/* -------- Combobox nổi: không đen, tìm không dấu, click + bàn phím -------- */
function comboMarkup(kind,value,options,meta={}){const opts=(options||[]).map(x=>typeof x==='string'?({value:x,label:x}):x),chosen=opts.find(x=>String(x.value)===String(value));const label=chosen?.label||'Tìm và chọn...';return `<div class="combo" data-combo-kind="${kind}" data-combo-meta="${att(JSON.stringify(meta))}" data-combo-options="${att(JSON.stringify(opts))}"><button type="button" class="combo-control"><span class="combo-display ${chosen?'':'muted'}">${esc(label)}</span>${icon('expand_more')}</button></div>`;}
function openCombo(el){closeCombo();let opts=[],meta={};try{opts=JSON.parse(el.dataset.comboOptions||'[]');meta=JSON.parse(el.dataset.comboMeta||'{}');}catch(e){}const p=document.createElement('div');p.id='combo-portal';p.className='combo-portal';p.innerHTML=`<div class="combo-portal-search"><input id="combo-search-input" placeholder="Tìm theo mã hoặc tên (có/không dấu)..." autocomplete="off"></div><div id="combo-list" class="combo-portal-list"></div>`;document.body.appendChild(p);APP.state.combo={el,p,opts,filtered:opts,index:0,meta,kind:el.dataset.comboKind};positionCombo();renderCombo();setTimeout(()=>document.getElementById('combo-search-input')?.focus(),0);}
function positionCombo(){const c=APP.state.combo;if(!c)return;const r=c.el.getBoundingClientRect(),p=c.p,width=Math.min(window.innerWidth-16,Math.max(300,r.width));p.style.width=width+'px';p.style.left=Math.max(8,Math.min(r.left,window.innerWidth-width-8))+'px';p.style.top=(r.bottom+5)+'px';if(r.bottom+340>window.innerHeight&&r.top>345)p.style.top=(r.top-330)+'px';}
function renderCombo(){const c=APP.state.combo;if(!c)return;const el=document.getElementById('combo-list');el.innerHTML=c.filtered.length?c.filtered.map((o,i)=>`<button class="combo-portal-option ${i===c.index?'active':''}" type="button" data-combo-index="${i}">${esc(o.label)}</button>`).join(''):`<div class="combo-empty">Không có kết quả.</div>`;}
function closeCombo(){document.getElementById('combo-portal')?.remove();APP.state.combo=null;}
function selectCombo(i){const c=APP.state.combo;if(!c)return;const item=c.filtered[i];if(!item)return;const {kind,meta}=c;if(kind==='data'){updateField(meta.module,meta.field,item.value,meta.part,Number(meta.index));c.el.querySelector('.combo-display').textContent=item.label;c.el.querySelector('.combo-display').classList.remove('muted');}
  if(kind==='filter'){APP.state.filters[meta.module]??={};APP.state.filters[meta.module][meta.filter]=item.value;APP.state.pageNo[meta.module]=1;renderPage();}
  if(kind==='sort'){APP.state.sort[meta.module]=item.value;renderPage();}
  if(kind==='size'){APP.state.pageSize[meta.module]=Number(item.value);APP.state.pageNo[meta.module]=1;renderPage();}
  if(kind==='catgroup'){APP.state.categoryGroup=item.value;renderCategories();}if(kind==='upload-module'){APP.state.upload.module=item.value;APP.state.upload.recordId='';renderUploadForm();}if(kind==='upload-record'){APP.state.upload.recordId=item.value;APP.state.upload.documentType=document.getElementById('upload-doc-type')?.value||'Tài liệu khác';renderUploadForm();}closeCombo();}
function updateField(module,field,value,part,index){const ctx=part==='grid'?APP.state.wizard?.context:APP.state.form?.context;if(ctx&&ctx.childKey===module&&field===ctx.foreignKey)return;
 const state=part==='grid'?APP.state.wizard?.rows[index]:part==='doc-parent'?APP.state.v85Document?.header:part==='doc-line'?APP.state.v85Document?.lines[index]:APP.state.form?.values;if(!state)return;state[field]=value;if(part==='grid'&&APP.state.wizard)APP.state.wizard.dirty=true;else if(part==='doc-parent'||part==='doc-line'){if(APP.state.v85Document)APP.state.v85Document.dirty=true;}else if(APP.state.form)APP.state.form.dirty=true;
  if(module==='fees'){
    if(field==='Mã nhóm lớp'&&Number(state['Học phí gốc']||0)===0){const c=dataOf('classes').find(x=>x['Mã nhóm lớp']===value);if(c)state['Học phí gốc']=Number(c['Mức học phí']||0);}
    let fee=Number(rawMoney(state['Học phí gốc'])||0),discount=Number(rawMoney(state['Miễn giảm'])||0);state['Phải thu']=Math.max(0,fee-discount);
    const scope=part==='grid'?`[data-form-part="grid"][data-rowindex="${index}"]`: `[data-form-part="single"]`;document.querySelectorAll(`[data-form-field="Phải thu"]${scope}`).forEach(el=>{el.value=money(state['Phải thu']);});if(field==='Mã nhóm lớp')document.querySelectorAll(`[data-form-field="Học phí gốc"]${scope}`).forEach(el=>{el.value=money(state['Học phí gốc']);});
  }
  if(window.chuaV85?.fieldChanged)window.chuaV85.fieldChanged(module,field,state,part,index);
  if(part!=='doc-parent'&&part!=='doc-line')updatePart2Computed(module,field,state,part,index);
  if(module==='tasks'&&field==='Trạng thái'&&value==='Hoàn thành'){state['Tiến độ']=100;document.querySelectorAll('[data-form-field="Tiến độ"]').forEach(el=>{if(part==='single'||Number(el.dataset.rowindex)===index)el.value='100';});}
}

/* -------- Tooltip portal dùng cho cả biểu mẫu và bảng -------- */
function showTooltip(anchor){const p=document.getElementById('tooltip-portal');if(!p)return;p.textContent=anchor.dataset.tooltip||'';p.classList.remove('hidden');const r=anchor.getBoundingClientRect();requestAnimationFrame(()=>{const box=p.getBoundingClientRect();let left=Math.max(8,Math.min(window.innerWidth-box.width-8,r.left)),top=r.bottom+6;if(top+box.height>window.innerHeight)top=Math.max(8,r.top-box.height-6);p.style.left=left+'px';p.style.top=top+'px';});}
function hideTooltip(){document.getElementById('tooltip-portal')?.classList.add('hidden');}

/* -------- Điều hướng, sự kiện toàn cục, không bind lặp -------- */
function registerEvents(){document.addEventListener('click',onClick);document.addEventListener('input',onInput);document.addEventListener('change',onChange);
  document.addEventListener('focusin',e=>{const t=e.target;if(t.classList.contains('currency-input')&&!t.readOnly)t.value=rawMoney(t.value);if(t.matches('[data-tooltip]'))showTooltip(t);});
  document.addEventListener('focusout',e=>{const t=e.target;if(t.classList.contains('currency-input')&&!t.readOnly){let v=Number(rawMoney(t.value)||0);t.value=t.value===''?'':money(v);}if(t.matches('[data-tooltip]'))hideTooltip();});
  document.addEventListener('mouseover',e=>{const a=e.target.closest('[data-tooltip]');if(a)showTooltip(a);});
  document.addEventListener('mouseout',e=>{const a=e.target.closest('[data-tooltip]');if(a&&!a.contains(e.relatedTarget))hideTooltip();});
  document.addEventListener('keydown',e=>{if(APP.state.combo){if(e.key==='Escape'){closeCombo();return;}if(['ArrowUp','ArrowDown','Enter'].includes(e.key)){e.preventDefault();let c=APP.state.combo;if(e.key==='Enter')return selectCombo(c.index);c.index=Math.max(0,Math.min(c.filtered.length-1,c.index+(e.key==='ArrowDown'?1:-1)));renderCombo();document.querySelector('.combo-portal-option.active')?.scrollIntoView({block:'nearest'});return;}}if(e.key==='Escape'){if(document.getElementById('modal-root').innerHTML)requestCloseModal();else hideEl('notification-popover');}});
  document.getElementById('collapse-sidebar')?.addEventListener('click',()=>switchMobile());document.getElementById('menu-toggle')?.addEventListener('click',()=>switchMobile());document.getElementById('mobile-sidebar-overlay')?.addEventListener('click',()=>switchMobile(false));
  window.addEventListener('resize',()=>{hideTooltip();closeCombo();});document.addEventListener('scroll',e=>{hideTooltip();if(e.target?.closest?.('#combo-portal'))return;closeCombo();},true);
}
let filterTimer=null;
function onInput(e){const t=e.target;if(t.id==='combo-search-input'&&APP.state.combo){let c=APP.state.combo;const q=norm(t.value);c.filtered=c.opts.filter(x=>norm(x.label).includes(q)||norm(x.value).includes(q));c.index=0;renderCombo();return;}
  if(t.dataset.search){APP.state.search[t.dataset.search]=t.value;APP.state.pageNo[t.dataset.search]=1;clearTimeout(filterTimer);const focusPos=t.selectionStart;filterTimer=setTimeout(()=>{renderModule(t.dataset.search);const n=document.querySelector('[data-search="'+t.dataset.search+'"]');if(n){n.focus();n.setSelectionRange(focusPos,focusPos);}},220);return;}
  if(t.dataset.formField){updateField(t.dataset.formModule,t.dataset.formField,t.value,t.dataset.formPart,Number(t.dataset.rowindex));}
}
function onChange(e){const t=e.target;if(t.id==='import-file'&&t.files?.[0])return readImportFile(t.files[0]);if(t.id==='upload-input')return selectUploadFiles([...t.files]);if(t.dataset.formField)updateField(t.dataset.formModule,t.dataset.formField,t.value,t.dataset.formPart,Number(t.dataset.rowindex));}
async function onClick(e){const t=e.target;const opt=t.closest('[data-combo-index]');if(opt){e.preventDefault();selectCombo(+opt.dataset.comboIndex);return;}
  const c=t.closest('.combo-control');if(c){e.preventDefault();openCombo(c.closest('.combo'));return;}
  const nav=t.closest('[data-page]');if(nav){e.preventDefault();if(canPage(nav.dataset.page))setPage(nav.dataset.page);return;}
  const pageBtn=t.closest('[data-nav]');if(pageBtn){APP.state.pageNo[pageBtn.dataset.nav]=Number(pageBtn.dataset.p)||1;renderPage();return;}
  const period=t.closest('[data-period]');if(period){selectPeriod(period.dataset.period);hideEl('period-menu');return;}
  const action=t.closest('[data-action]');if(action){e.preventDefault();if(action.closest('#notification-popover'))hideEl('notification-popover');await routeAction(action.dataset.action,action);return;}
  if(t.closest('#period-trigger')){toggleMenu('period-menu',document.getElementById('period-trigger'));return;}
  if(!t.closest('#period-menu'))hideEl('period-menu');if(!t.closest('#notification-popover'))hideEl('notification-popover');if(!t.closest('#user-dropdown')&&!t.closest('#user-menu-trigger'))hideEl('user-dropdown');if(!t.closest('#combo-portal'))closeCombo();
}
async function routeAction(action,el){const key=el.dataset.module,id=el.dataset.id;
  if(action.startsWith('gallery-'))return window.Gallery?.action(action,el);
  const featureOps=['new-row','new-wizard','wizard-add','wizard-duplicate-last','wizard-copy','wizard-remove','wizard-remove-blank','wizard-toggle-row','wizard-collapse-all','wizard-expand-all','wizard-file-select','wizard-file-remove','wizard-next','wizard-back','wizard-save','new-category','edit-category','save-category','category-next','category-back','delete-category'];
  if(featureOps.includes(action)&&window.__CHUA_FEATURE_READY!==true){
    return toast('Chức năng nhập liệu chưa sẵn sàng','Phần Wizard đang gặp lỗi, nhưng đăng nhập và Dashboard vẫn hoạt động. Kiểm tra JavaScript của bản triển khai.','error',9000);
  }

  if(action==='logout')return doLogout();
  if(action==='user-menu')return toggleMenu('user-dropdown',el);
  if(action==='my-profile')return showMyProfile();
  if(!guardAction(action,key)){toast('Không đủ quyền','Bạn không có quyền thực hiện thao tác này.','warning');return;}
  if(action==='retry-startup')return initializeApp();
  if(action==='refresh-data')return requestDiscardDraft(()=>refreshAll());
  if(action==='toggle-notifications')return toggleNotifications(el);
  if(action==='close-modal')return requestCloseModal();
  if(action==='close-confirm')return closeConfirm();
  if(action==='new-row'){const ctx=APP.state.linkedContext;if(ctx&&ctx.childKey===key)return window.chuaV85?.createRelated?.(ctx.sourceKey,ctx.sourceId,ctx.childKey,ctx.foreignKey,true);return window.chuaV85?.openNew?window.chuaV85.openNew(key):newWizard(key);}
  if(action==='edit-row')return openForm(key,id);
  if(action==='view-row')return viewRecord(key,id);
  if(action==='delete-row')return removeRecord(key,id);
  if(action==='save-row')return saveForm();
  if(action==='new-category')return categoryModal();
  if(action==='edit-category')return categoryModal(el.dataset.value);
  if(action==='save-category')return saveCategory();
  if(action==='category-next')return categoryNext();
  if(action==='category-back'){APP.state.form.step=1;return renderCategoryWizard();}
  if(action==='delete-category')return deleteCategory(el.dataset.value);
  if(action==='new-wizard'){const ctx=APP.state.linkedContext;if(ctx&&ctx.childKey===key)return window.chuaV85?.createRelated?.(ctx.sourceKey,ctx.sourceId,ctx.childKey,ctx.foreignKey,true);return newWizard(key);}
  if(action==='wizard-add')return wizardAdd(Number(el.dataset.count)||1);
  if(action==='wizard-duplicate-last')return wizardCopy(APP.state.wizard.rows.length-1);
  if(action==='wizard-copy')return wizardCopy(+el.dataset.i);
  if(action==='wizard-remove')return wizardRemove(+el.dataset.i);
  if(action==='wizard-remove-blank')return wizardRemoveBlank();
  if(action==='wizard-toggle-row')return wizardToggleRow(+el.dataset.i);
  if(action==='wizard-collapse-all')return wizardCollapseAll(true);
  if(action==='wizard-expand-all')return wizardCollapseAll(false);
  if(action==='wizard-file-select')return wizardSelectFiles(+el.dataset.i,el.dataset.multiple==='1',el.dataset.kind||'Tài liệu liên quan');
  if(action==='wizard-file-remove')return wizardRemoveFile(+el.dataset.i,+el.dataset.file);
  if(action==='wizard-next')return wizardNext();
  if(action==='wizard-back'){APP.state.wizard.step=1;return renderWizard();}
  if(action==='v883-back-source')return window.chuaV85?.goBackLinkedSource?.();
  if(action==='v883-show-all')return window.chuaV85?.exitLinkedList?.();
  if(action==='v883-wizard-view')return changeWizardView(el.dataset.view);
  if(action==='v883-detail-back')return window.chuaV85?.backRelatedRecord?.();
  if(action==='wizard-save')return wizardSave();
  if(action==='open-import')return openImportModal(key);
  if(action==='import-read')return document.getElementById('import-file')?.click();
  if(action==='import-save')return saveImportData();
  if(action==='download-template')return exportXlsx(key,true);
  if(action==='export-xlsx')return exportXlsx(key,false);
  if(action==='upload-file')return openUploadForm();
  if(action==='attach-row')return openUploadForm(key,id);
  if(action==='upload-select')return document.getElementById('upload-input')?.click();
  if(action==='upload-save')return saveUploadFromForm();
  if(action==='preview-local-upload')return previewLocalUpload(Number(el.dataset.index));
  if(action==='view-file')return previewUploadedFile(id);
  if(action==='close-preview')return closePreview();
  if(action==='delete-file')return deleteFileWithConfirm(id);
  if(action.indexOf('ec-')===0)return window.EmailCenter?.action(action,el);
  if(action==='email-config')return setPage('emailCenter');
  if(action==='email-test')return window.EmailCenter?.test();
    if(action==='load-heavy-report')return loadExtendedReport();
  if(action==='custom-period')return customPeriod();
}
async function refreshAll(){const t=toast('Đang làm mới','Đồng bộ lại dữ liệu từ Google Sheet...','processing',0);try{let d=await gas('getBootstrapData',{timeout:90000});APP.bootGeneration++;APP.data=d;setAuthUi(d.session,d.permissions);APP.deferredStatus='pending';window.Gallery?.reset();renderPage();scheduleDeferredData();toastUpdate(t,'Đã làm mới','Dữ liệu đã được cập nhật.');}catch(e){toastUpdate(t,'Làm mới thất bại',e.message,'error',6500);}}
function customPeriod(){hideEl('period-menu');const p=APP.state.period;modal('Chọn khoảng ngày','Áp dụng cho các chỉ số của Dashboard.',`<div class="form-grid"><div class="form-field"><label>Từ ngày</label><input type="date" id="period-from" value="${dateInput(p.from)}"></div><div class="form-field"><label>Đến ngày</label><input type="date" id="period-to" value="${dateInput(p.to)}"></div></div>`,`<button class="btn" data-action="close-modal">Hủy</button><button class="btn btn-primary" id="period-apply">Áp dụng</button>`,'small');document.getElementById('period-apply').onclick=()=>{let f=parseDate(document.getElementById('period-from').value),t=parseDate(document.getElementById('period-to').value);if(!f||!t||t<f)return toast('Khoảng ngày sai','Ngày đến phải bằng hoặc sau ngày bắt đầu.','warning');APP.state.period={key:'custom',from:f,to:t,label:displayDate(f)+' - '+displayDate(t)};setText('period-label',APP.state.period.label);closeModal();renderPage();};}
// --- PART 2 FEATURES ---
function isPosted(r){return ['Đã xác nhận','Hoàn thành','Đã thu','Đã duyệt','Đã hoàn','Đã thanh toán'].includes(r['Trạng thái']);}
function scheduleDeferredData(){
  APP.deferredStatus='loading';const observedVersion={...APP.localVersion},generation=APP.bootGeneration;
  // Bắt đầu SAU khi giao diện đã hiển thị, không ràng buộc với chuyển tab.
  requestAnimationFrame(()=>setTimeout(async()=>{
    try{const result=await gas('getDeferredData',{timeout:60000});if(generation!==APP.bootGeneration||!APP.token)return;Object.entries(result.modules||{}).forEach(([k,rows])=>{if((APP.localVersion[k]||0)===(observedVersion[k]||0))APP.data.modules[k]=rows;});APP.deferredStatus='done';
      if(['files','emails','audit'].includes(APP.state.page)||window.chuaV86?.visualModules?.has(APP.state.page))renderModule(APP.state.page);
    }catch(error){if(generation!==APP.bootGeneration)return;APP.deferredStatus='error';console.warn('Tải dữ liệu phụ:',error);
      if(['files','emails','audit'].includes(APP.state.page)||window.chuaV86?.visualModules?.has(APP.state.page))renderModule(APP.state.page);
      toast('Dữ liệu phụ chưa đồng bộ','Tài liệu/lịch sử chưa tải được. Bấm Làm mới để thử lại.','warning',5000);
    }
  },250),{once:true});
}
function applyServerPatches(patches){
  Object.entries(patches||{}).forEach(([key,rows])=>{if(Array.isArray(rows)){APP.data.modules[key]=rows;APP.localVersion[key]=(APP.localVersion[key]||0)+1;}});
  notifications();
}
function part2StockQty(sku,store){return dataOf('stockLedger').filter(r=>r['Mã SKU']===sku&&r['Mã kho']===store)
  .reduce((s,r)=>s+Number(r['Số lượng nhập']||0)-Number(r['Số lượng xuất']||0),0);}
function updatePart2Computed(module,field,row,part,index){
  if(!row)return;const num=f=>Number(rawMoney(row[f])||0);
  if((module==='purchaseItems'||module==='orderItems')&&['Số lượng','Đơn giá nhập','Đơn giá bán','Mã SKU'].includes(field)){
    const cost=module==='purchaseItems'?'Đơn giá nhập':'Đơn giá bán';
    if(field==='Mã SKU'&&!num(cost)){
      const product=dataOf('products').find(x=>x['Mã SKU']===row['Mã SKU']);if(product){row[cost]=Number(product[module==='purchaseItems'?'Giá nhập':'Giá bán']||0);if(module==='orderItems')row['Size']=product['Size']||'';}
    }
    row['Thành tiền']=num('Số lượng')*num(cost);
  }
  if(module==='stocktakes'&&['Mã SKU','Mã kho','Tồn thực tế'].includes(field)){
    row['Tồn hệ thống']=part2StockQty(row['Mã SKU'],row['Mã kho']);row['Chênh lệch']=num('Tồn thực tế')-Number(row['Tồn hệ thống']);
  }
  if(['purchaseItems','orderItems','stocktakes'].includes(module)){
    ['Thành tiền','Đơn giá nhập','Đơn giá bán','Tồn hệ thống','Chênh lệch','Size'].forEach(k=>{
      if(!Object.prototype.hasOwnProperty.call(row,k))return;
      const selector=`[data-form-field="${k}"][data-form-part="${part}"]${part==='grid'?`[data-rowindex="${index}"]`:''}`;
      document.querySelectorAll(selector).forEach(input=>{if(input!==document.activeElement)input.value=k==='Size'?String(row[k]):money(row[k]);});
    });
  }
}
function formatAsVnd(x){return money(x)+' đ';}
function reportRowsByFund(){
  const map=new Map();dataOf('finance').filter(isPosted).forEach(r=>{const id=r['Mã quỹ']||'Chưa phân quỹ';const c=map.get(id)||{id,in:0,out:0};const n=Number(r['Số tiền']||0);if(r['Loại giao dịch']==='Chi')c.out+=n;else c.in+=n;map.set(id,c);});
  return [...map.values()].map(r=>({...r,balance:r.in-r.out}));
}
function renderReports(){
  const finance=dataOf('finance').filter(isPosted),funds=reportRowsByFund();const inc=finance.filter(r=>r['Loại giao dịch']==='Thu').reduce((s,r)=>s+Number(r['Số tiền']||0),0),
    out=finance.filter(r=>r['Loại giao dịch']==='Chi').reduce((s,r)=>s+Number(r['Số tiền']||0),0),
    debt=dataOf('orders').reduce((s,r)=>s+Number(r['Còn nợ']||0),0),income=dataOf('fees').reduce((s,r)=>s+Number(r['Phải thu']||0),0);
  const products=dataOf('products'),stock=dataOf('stockLedger');
  let negative=0;const byStock=new Map();stock.forEach(r=>{const code=r['Mã kho']+'|'+r['Mã SKU'];byStock.set(code,(byStock.get(code)||0)+Number(r['Số lượng nhập']||0)-Number(r['Số lượng xuất']||0));});byStock.forEach(v=>{if(v<0)negative++;});
  htmlEl('page-content',`<div class="page-shell">${head('Báo cáo tổng hợp','Tất cả chỉ số cơ bản tính trực tiếp từ global state; không gọi server khi mở tab.',`<button class="btn" data-action="load-heavy-report">${icon('analytics')} Phân tích chuyên sâu</button><button class="btn" data-action="export-xlsx" data-module="finance">${icon('download')} Xuất giao dịch</button>`)}
    <div class="kpi-grid">${dashboardKpi('Tổng thu',formatAsVnd(inc),'Đã xác nhận','green','payments')}${dashboardKpi('Tổng chi',formatAsVnd(out),'Đã xác nhận','red','account_balance_wallet')}${dashboardKpi('Chênh lệch',formatAsVnd(inc-out),'Thu trừ chi','blue','monitoring')}${dashboardKpi('Công nợ bán hàng',formatAsVnd(debt),'Từ đơn bán','orange','receipt_long')}${dashboardKpi('Khoản học phí',formatAsVnd(income),'Phải thu gốc và giảm trừ','violet','school')}${dashboardKpi('Số SKU',products.length,'Sản phẩm đang quản lý','blue','inventory_2')}${dashboardKpi('Giao dịch sổ kho',stock.length,'Bút toán tồn kho','green','warehouse')}${dashboardKpi('Tồn âm cần kiểm tra',negative,'Theo kho và SKU','red','warning')}</div>
    <div class="panel section-card" style="margin-bottom:12px"><div class="section-title-row"><h2>Thu, chi theo quỹ</h2><small>Cập nhật từ chứng từ đã xác nhận</small></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>Quỹ</th><th>Tổng thu</th><th>Tổng chi</th><th>Chênh lệch</th></tr></thead><tbody>${funds.map(r=>`<tr><td>${esc(lookup('funds',r.id))}</td><td>${formatAsVnd(r.in)}</td><td>${formatAsVnd(r.out)}</td><td>${formatAsVnd(r.balance)}</td></tr>`).join('')||'<tr><td colspan="4">Chưa có giao dịch tài chính được xác nhận</td></tr>'}</tbody></table></div></div>
    <div class="panel section-card"><h2>Diễn biến doanh thu</h2><div id="report-chart-region"><p class="muted">Bấm Phân tích chuyên sâu để tải dữ liệu tổng hợp. Thư viện biểu đồ không tải khi khởi động.</p></div></div></div>`);
}
let reportCharts=[];
async function loadExternalOnce(name,url,globalKey){
  if(window[globalKey])return window[globalKey];if(APP.scripts[name])return APP.scripts[name];
  APP.scripts[name]=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=url;script.async=true;
    const timeout=setTimeout(()=>{script.remove();APP.scripts[name]=null;reject(Error('Thư viện '+name+' tải quá thời gian.'));},20000);
    script.onload=()=>{clearTimeout(timeout);if(window[globalKey])resolve(window[globalKey]);else reject(Error('Không khởi tạo được '+name));};
    script.onerror=()=>{clearTimeout(timeout);APP.scripts[name]=null;reject(Error('Không thể tải '+name+'. Kiểm tra Internet/CDN.'));};
    document.head.appendChild(script);
  });return APP.scripts[name];
}
const excelLib=()=>loadExternalOnce('ExcelJS','https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js','ExcelJS');
const chartLib=()=>loadExternalOnce('Chart.js','https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js','Chart');
async function loadExtendedReport(){
  const el=document.getElementById('report-chart-region');if(!el)return;
  el.textContent='Đang tổng hợp báo cáo riêng, có thể chuyển tab trong lúc xử lý...';
  try{
    const result=await gas('getAggregatedReport',{timeout:90000});
    APP.state.lastHeavyReport=result;if(APP.state.page!=='reports')return;
    el.innerHTML='<div class="chart-wrap" style="height:320px"><canvas id="report-chart"></canvas></div>';
    await chartLib();if(APP.state.page!=='reports')return;
    reportCharts.forEach(x=>{try{x.destroy();}catch(e){}});reportCharts=[];
    const monthly=result.monthly||{},labels=Object.keys(monthly).sort((a,b)=>{const aa=a.split('/'),bb=b.split('/');return (+aa[1]*12+ +aa[0])-(+bb[1]*12+ +bb[0]);});
    const chartEl=document.getElementById('report-chart');if(!chartEl)return;
    reportCharts.push(new Chart(chartEl,{type:'bar',data:{labels:labels,datasets:[{label:'Dòng tiền ròng (VND)',data:labels.map(k=>monthly[k]),backgroundColor:'#3486da',borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true}},scales:{y:{beginAtZero:false}}}}));
  }catch(e){if(APP.state.page==='reports')el.textContent='Không thể tải báo cáo: '+e.message;toast('Báo cáo lỗi',e.message,'error',6000);}
}
function filesOfModule(module,id){const c=cfgOf(module);return dataOf('files').filter(x=>x['Phân hệ']===c.sheet&&x['Mã bản ghi liên kết']===id&&x['Trạng thái']!=='Đã xóa');}
function displayLinkedAttachments(module,id){const list=filesOfModule(module,id);return list.map(x=>`<button class="btn btn-sm" data-action="view-file" data-id="${att(x['Mã tài liệu'])}">${icon('attach_file')} ${esc(x['Tên file'])}</button>`).join('');}
function showFileRecordExtras(key,id){const html=displayLinkedAttachments(key,id);return html?`<div class="panel section-card"><h3>Đính kèm</h3><div class="page-actions">${html}</div></div>`:'';}
function readSelectedRowsForTemplate(key){const cfg=cfgOf(key);return cfg.fields.filter(f=>f!==cfg.id&&!(cfg.system||[]).includes(f)&&!(cfg.computed||[]).includes(f));}
function workbookCell(v,f,cfg){if((cfg.dates||[]).includes(f))return parseDate(v)||v||'';if((cfg.numbers||[]).includes(f))return Number(v||0);return v??'';}
function getWorkbookOptions(key,field){const opts=optionsForField(key,field);return (opts||[]).map(o=>String(o.value??o.label??'')).filter(Boolean);}
async function exportXlsx(key,template=false){
  const cfg=cfgOf(key);if(!cfg)return toast('Không thể xuất','Module chưa sẵn sàng.','error');
  const t=toast('Đang tạo Excel','Thư viện Excel chỉ tải khi người dùng yêu cầu.','processing',0);
  try{
    const ExcelJS=await excelLib(),wb=new ExcelJS.Workbook();wb.creator='Web App Quản lý Hoạt động Chùa';
    const ws=wb.addWorksheet(cfg.sheet,{views:[{state:'frozen',ySplit:1}]});const fields=template?readSelectedRowsForTemplate(key):cfg.fields;
    fields.forEach((f,i)=>{ws.getRow(1).getCell(i+1).value=f;});ws.getRow(1).eachCell(cell=>{cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF285E70'}};cell.font={bold:true,color:{argb:'FFFFFFFF'},size:11};cell.alignment={vertical:'middle'};});ws.getRow(1).height=30;
    const rows=template?[]:(APP.state._v48ExportIds?.[key]?dataOf(key).filter(r=>APP.state._v48ExportIds[key].includes(String(r[cfg.id]))):filteredRows(key));
    rows.forEach(r=>{const cells=fields.map(f=>workbookCell(r[f],f,cfg));let row=ws.getRow(ws.rowCount+1);cells.forEach((v,i)=>{row.getCell(i+1).value=v;});fields.forEach((f,i)=>{if((cfg.dates||[]).includes(f))row.getCell(i+1).numFmt='dd/mm/yyyy';if((cfg.periods||[]).includes(f))row.getCell(i+1).numFmt='mm/yyyy';if((cfg.numbers||[]).includes(f))row.getCell(i+1).numFmt='#,##0.##';if((cfg.phone||[]).includes(f))row.getCell(i+1).numFmt='@';});});
    fields.forEach((f,i)=>{ws.getColumn(i+1).width=Math.min(34,Math.max(17,f.length*1.15+4));});
    if(template){
      const optSheet=wb.addWorksheet('Lua_chon',{state:'veryHidden'});let opCol=1;
      fields.forEach((f,i)=>{const opts=getWorkbookOptions(key,f);if(!opts.length)return;
        let c=optSheet.getColumn(opCol);c.values=['Lựa chọn '+f,...opts];const letter=c.letter;const label='CHUA_OPT_'+opCol;
        wb.definedNames.add(`'Lua_chon'!$${letter}$2:$${letter}$${opts.length+1}`,label);
        for(let r=2;r<=301;r++)ws.getCell(r,i+1).dataValidation={type:'list',allowBlank:true,formulae:[label],showErrorMessage:true,error:'Hãy chọn dữ liệu từ danh sách.'};opCol++;
      });
      for(let r=2;r<=301;r++)fields.forEach((f,i)=>{
        const cell=ws.getCell(r,i+1);
        if((cfg.dates||[]).includes(f))cell.numFmt='dd/mm/yyyy';
        if((cfg.periods||[]).includes(f))cell.numFmt='mm/yyyy';
        if((cfg.phone||[]).includes(f))cell.numFmt='@';
        if((cfg.numbers||[]).includes(f))cell.numFmt='#,##0.##';
      });
      for(let r=2;r<=41;r++)ws.getRow(r).height=22;
    }
    const buf=await wb.xlsx.writeBuffer();const blob=new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const name=(template?'MAU_IMPORT_':'EXPORT_')+cfg.sheet.replace(/[^\p{L}\p{N}]+/gu,'_')+'.xlsx';downloadBlob(name,blob);
    toastUpdate(t,'Đã xuất Excel',name,'success',3500);
  }catch(e){toastUpdate(t,'Không xuất được Excel',e.message,'error',6500);}
}
function downloadBlob(filename,blob){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);}
function openImportModal(key){if(!canWrite(key)||key==='users'||cfgOf(key).readOnly||BLOCKED_TRANSACTION_KEYS.has(key))return toast('Chưa hỗ trợ Import hàng loạt','Phân hệ này phát sinh chứng từ và số dư; hãy nhập trực tiếp từng chứng từ.','warning');
  APP.state.import={key,rows:[],valid:[],errors:[],reading:false,filename:''};renderImportModal();
}
function renderImportModal(){const state=APP.state.import;if(!state)return;const cfg=cfgOf(state.key),headers=readSelectedRowsForTemplate(state.key);
  let preview=state.rows.length?`<div class="module-summary"><div class="panel"><small>Tổng dòng</small><strong>${state.rows.length}</strong></div><div class="panel"><small>Hợp lệ</small><strong>${state.valid.length}</strong></div><div class="panel"><small>Lỗi</small><strong>${state.errors.length}</strong></div></div><div class="data-table-wrap" style="max-height:46vh;overflow:auto"><table class="data-table"><thead><tr><th>Dòng</th><th>Trạng thái</th><th>Vấn đề</th>${headers.slice(0,4).map(f=>`<th>${esc(f)}</th>`).join('')}</tr></thead><tbody>${state.rows.slice(0,100).map((r,i)=>{const issue=state.issues?.[i]||[];return `<tr><td>${i+2}</td><td>${issue.length?badge('Lỗi'):badge('Hợp lệ')}</td><td>${esc(issue.join('; ')||'-')}</td>${headers.slice(0,4).map(f=>`<td>${esc(r[f]||'-')}</td>`).join('')}</tr>`;}).join('')}</tbody></table></div>`:'<p class="muted">Tải file mẫu, giữ nguyên header. Chọn XLSX để kiểm tra dữ liệu trước khi lưu.</p>';
  modal('Import '+cfg.title,'Chỉ lưu dòng hợp lệ; không ghi dữ liệu khi vừa chọn file.',`<div class="page-actions" style="margin-bottom:12px"><button class="btn" data-action="download-template" data-module="${state.key}">${icon('download')} Tải mẫu XLSX</button><button class="btn btn-primary" data-action="import-read">${icon('upload_file')} Chọn Excel</button><input id="import-file" type="file" accept=".xlsx" class="hidden"><span class="muted">${esc(state.filename)}</span></div>${preview}`,`<button class="btn" data-action="close-modal">Hủy</button><button class="btn btn-primary" ${state.valid.length&&!state.saving?'':'disabled'} data-action="import-save">${icon('save')} Lưu ${state.valid.length} dòng hợp lệ</button>`,'xwide');
}
function normalizeImported(v,field,cfg){if(v==null)return '';if(v instanceof Date)return (cfg.periods||[]).includes(field)?`${String(v.getMonth()+1).padStart(2,'0')}/${v.getFullYear()}`:displayDate(v);if(typeof v==='object')return v.text||v.result||'';return typeof v==='string'?v.trim():v;}
function validateImportRow(key,record,previous){
  const cfg=cfgOf(key),errors=validateClient(key,record);
  Object.keys(cfg.refs||{}).forEach(f=>{const target=cfg.refs[f],code=record[f];if(code&&!dataOf(target).some(r=>String(r[cfgOf(target).id])===String(code)))errors.push(f+' không tồn tại');});
  Object.keys(cfg.cats||{}).forEach(f=>{if(record[f]&&!(APP.data.categories[cfg.cats[f]]||[]).includes(record[f]))errors.push(f+' không có trong danh mục');});
  if((cfg.unique||[]).length){const fingerprint=r=>(cfg.unique||[]).map(f=>norm(r[f])).join('|');
    if(dataOf(key).some(r=>fingerprint(r)===fingerprint(record))||previous.some(r=>fingerprint(r)===fingerprint(record)))errors.push('Dữ liệu trùng khóa nghiệp vụ');}
  return errors;
}
async function readImportFile(file){const state=APP.state.import;if(!state)return;state.filename=file.name;
  const t=toast('Đang đọc Excel','Không lưu cho đến khi kiểm tra hoàn tất.','processing',0);
  try{
    const ExcelJS=await excelLib(),wb=new ExcelJS.Workbook();await wb.xlsx.load(await file.arrayBuffer());
    const sheet=wb.worksheets.find(x=>x.state==='visible')||wb.worksheets[0];if(!sheet)throw Error('Không có worksheet để đọc.');
    const cfg=cfgOf(state.key),expected=readSelectedRowsForTemplate(state.key),headings=sheet.getRow(1).values.slice(1).map(v=>String(v||'').trim());
    const notFound=expected.filter(h=>!headings.includes(h));if(notFound.length)throw Error('File thiếu cột: '+notFound.slice(0,5).join(', '));
    const recs=[];sheet.eachRow((row,rowN)=>{if(rowN===1)return;const rec={};expected.forEach(f=>{rec[f]=normalizeImported(row.getCell(headings.indexOf(f)+1).value,f,cfg);});if(Object.values(rec).some(v=>String(v??'').trim()))recs.push(rec);});
    if(recs.length>150)throw Error('Mỗi lần chỉ nhập tối đa 150 dòng.');
    state.rows=recs;state.valid=[];state.errors=[];state.issues=[];
    recs.forEach((r,i)=>{const errors=validateImportRow(state.key,r,state.valid);state.issues[i]=errors;if(errors.length)state.errors.push({line:i+2,errors});else state.valid.push(r);});
    toastUpdate(t,'Đã kiểm tra dữ liệu',`${state.valid.length} hợp lệ, ${state.errors.length} dòng lỗi.`,'success');renderImportModal();
  }catch(e){toastUpdate(t,'Không đọc được Excel',e.message,'error',7500);renderImportModal();}
}
async function saveImportData(){const state=APP.state.import;if(!state?.valid?.length||state.saving)return;state.saving=true;const copy={...state,valid:[...state.valid]};
  const t=toast('Đang Import',`Đang lưu ${copy.valid.length} dòng dữ liệu.`, 'processing',0);renderImportModal();
  try{const response=await gas('importModuleRows',copy.key,copy.valid,{timeout:120000});response.rows.forEach(r=>mergeRow(copy.key,r));applyServerPatches(response.patches);closeModal();if(APP.state.page===copy.key)renderPage();toastUpdate(t,response.warnings?.length?'Import đã ghi, đồng bộ phụ cần kiểm tra':'Import hoàn tất',response.warnings?.length?response.warnings.slice(0,2).join('; '):`Đã lưu ${response.rows.length} dòng. ${copy.errors.length} dòng lỗi không được ghi.`,response.warnings?.length?'warning':'success',response.warnings?.length?10000:4000);}
  catch(e){state.saving=false;renderImportModal();toastUpdate(t,'Import thất bại',e.message,'error',8000);}
}
function uploadCandidateModules(){return Object.keys(APP.data.schema).filter(k=>canWrite(k)&&!APP.data.schema[k].readOnly&&k!=='users');}
function uploadModuleOptions(){return uploadCandidateModules().map(k=>({value:k,label:cfgOf(k).title}));}
function uploadRecordOptions(module){const cfg=cfgOf(module);return dataOf(module).slice(0,1500).map(r=>({value:r[cfg.id],label: r[cfg.id]+' · '+String(r[cfg.required?.[0]||cfg.id]||'')}));}
function openUploadForm(module='',recordId=''){APP.state.upload={module,recordId,files:[],documentType:'Tài liệu khác'};renderUploadForm();}
function renderUploadForm(){const st=APP.state.upload;if(!st)return;
  const fileList=st.files.map((f,i)=>`<div class="file-chip"><span class="material-symbols-rounded">draft</span><span>${esc(f.name)} · ${(f.size/1024).toFixed(0)} KB</span><button class="row-action" type="button" title="Xem trước" data-action="preview-local-upload" data-index="${i}">${icon('visibility')}</button></div>`).join('');
  modal('Tài liệu đính kèm','Tải file được tách khỏi luồng khởi động. Mỗi file gắn đúng bản ghi.',`<div class="form-grid">
    <div class="form-field"><label>Phân hệ</label>${comboMarkup('upload-module',st.module,uploadModuleOptions())}<div class="field-help">Chọn phân hệ đã có hồ sơ.</div></div>
    <div class="form-field"><label>Mã hồ sơ liên kết</label>${st.module?comboMarkup('upload-record',st.recordId,uploadRecordOptions(st.module)):'<p class="muted">Chọn phân hệ trước.</p>'}</div>
    <div class="form-field full"><label>Loại tài liệu</label><input id="upload-doc-type" value="${att(st.documentType)}" placeholder="Hình ảnh, hợp đồng, biên bản..."></div>
    <div class="form-field full"><label>Chọn file</label><div class="upload-zone"><div class="upload-zone-copy"><strong>Ảnh, PDF, Word, Excel, CSV hoặc TXT</strong><small>Giới hạn mỗi file 12 MB; có thể chọn nhiều file. Chỉ tải lên khi bấm Lưu.</small></div><button class="btn" data-action="upload-select" type="button">${icon('attach_file')} Chọn file</button></div><input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" id="upload-input" class="hidden">${fileList}</div>
    </div>`,`<button class="btn" data-action="close-modal">Hủy</button><button class="btn btn-primary" data-action="upload-save" ${st.recordId&&st.files.length?'':'disabled'}>${icon('cloud_upload')} Lưu ${st.files.length} file</button>`,'wide');
}
async function previewLocalUpload(index){
  const file=APP.state.upload?.files?.[index];if(!file)return;
  htmlEl('preview-root',`<div class="preview-overlay"><div class="preview-modal"><div class="preview-head"><strong>${esc(file.name)}</strong><button class="btn" data-action="close-preview">Đóng</button></div><div id="local-preview-body" class="preview-body">Đang đọc file đã chọn...</div></div></div>`);
  try{const data=await localFileToDataUrl(file),target=document.getElementById('local-preview-body');if(!target)return;
    if(file.type.startsWith('image/'))target.innerHTML=`<img src="${att(data)}" alt="${att(file.name)}">`;
    else if(file.type==='application/pdf')target.innerHTML=`<iframe title="Xem trước PDF" src="${att(data)}"></iframe>`;
    else target.innerHTML='<div class="preview-fallback">Định dạng này xem sau khi tải lên Drive.</div>';
  }catch(e){const target=document.getElementById('local-preview-body');if(target)target.textContent='Không thể đọc file: '+e.message;}
}
function selectUploadFiles(files){const st=APP.state.upload;if(!st)return;const valid=files.filter(f=>f.size<=12*1024*1024&&f.size>0);if(valid.length!==files.length)toast('Giới hạn file','Một số file quá 12 MB hoặc rỗng.','warning');st.files=[...st.files,...valid].slice(0,6);st.documentType=document.getElementById('upload-doc-type')?.value||'Tài liệu khác';renderUploadForm();}
function localFileToDataUrl(file){return new Promise((ok,fail)=>{const reader=new FileReader();reader.onload=()=>ok(reader.result);reader.onerror=()=>fail(Error('Không đọc được file '+file.name));reader.readAsDataURL(file);});}
async function saveUploadFromForm(){const st=APP.state.upload;if(!st?.recordId||!st.files.length)return;const captured={...st,files:[...st.files],documentType:document.getElementById('upload-doc-type')?.value||st.documentType};
  closeModal();const t=toast('Đang upload',`Đang tải ${captured.files.length} file lên Google Drive. Có thể sử dụng chức năng khác.`, 'processing',0);
  let success=0,fail=[];
  for(const file of captured.files){try{
      const dataUrl=await localFileToDataUrl(file);const response=await gas('saveUploadedFile',{
        module:captured.module,recordId:captured.recordId,fileName:file.name,mimeType:file.type||'application/octet-stream',size:file.size,dataUrl,documentType:captured.documentType
      },{timeout:180000});
      APP.data.modules.files??=[];mergeRow('files',response.file);if(response.linked)mergeRow(captured.module,response.linked);success++;
      toastUpdate(t,'Đang upload',`${success}/${captured.files.length} file thành công, vẫn có thể thao tác các phần khác.`, 'processing',0);
    }catch(e){fail.push(file.name+': '+e.message);}}
  if(APP.state.page==='files'||APP.state.page===captured.module)renderPage();
  toastUpdate(t,fail.length?'Upload chưa hoàn tất':'Tải file thành công',`${success}/${captured.files.length} file được lưu. ${fail.slice(0,2).join('; ')}`,fail.length?'warning':'success',fail.length?8500:4000);
}
function closePreview(){htmlEl('preview-root','');}
async function previewUploadedFile(id){const meta=dataOf('files').find(r=>r['Mã tài liệu']===id);if(!meta)return toast('Không tìm thấy file',id,'error');
  htmlEl('preview-root',`<div class="preview-overlay"><div class="preview-modal"><div class="preview-head"><div class="preview-title"><strong>${esc(meta['Tên file'])}</strong><small>${esc(meta['MIME type'])}</small></div><div class="preview-actions"><a class="btn" href="${att(meta['Link xem'])}" target="_blank" rel="noopener noreferrer">Mở Drive</a><button class="btn" data-action="close-preview">Đóng</button></div></div><div id="file-preview-area" class="preview-body"><div class="preview-loading"><span class="spinner"></span>Đang đọc file từ Google Drive...</div></div></div></div>`);
  try{const result=await gas('getUploadedFilePreview',id,{timeout:60000}),area=document.getElementById('file-preview-area');if(!area)return;
    if(result.kind==='image')area.innerHTML=`<img alt="${att(meta['Tên file'])}" src="${att(result.dataUrl)}">`;
    else if(result.kind==='pdf')area.innerHTML=`<iframe title="Xem PDF" src="${att(result.dataUrl)}"></iframe>`;
    else if(result.kind==='text'){const pre=document.createElement('pre');pre.className='preview-text';pre.textContent=result.text;area.replaceChildren(pre);}
    else area.innerHTML=`<div class="preview-fallback">${icon('description')}<h3>Không hỗ trợ preview trực tiếp</h3><p>${esc(result.note||'Mở file qua Drive hoặc tải xuống.')}</p><a class="btn" href="${att(meta['Link xem'])}" target="_blank" rel="noopener noreferrer">Mở trên Drive</a></div>`;
  }catch(e){const area=document.getElementById('file-preview-area');if(area)area.textContent='Không thể xem file: '+e.message;}
}
function deleteFileWithConfirm(id){confirmBox('Xóa file đính kèm','File sẽ được chuyển vào Thùng rác Google Drive, metadata chuyển trạng thái Đã xóa.',async()=>{
  const t=toast('Đang xóa tài liệu','Xử lý Drive độc lập với tải dữ liệu.','processing',0);
  try{const r=await gas('deleteUploadedFile',id,{timeout:65000});mergeRow('files',r.file);if(r.module&&r.linked)mergeRow(r.module,r.linked);if(APP.state.page==='files'||APP.state.page===r.module)renderPage();toastUpdate(t,'Đã xóa file',id);}
  catch(e){toastUpdate(t,'Xóa file thất bại',e.message,'error',6000);}
});}
function showReminderConfig(){
 const loading=toast('Đang kiểm tra','Kiểm tra trigger và hạn mức gửi mail của tài khoản thực thi.','processing',0);
 gas('getReminderEmailStatus',{timeout:25000}).then(r=>{
  toastUpdate(loading,'Đã kiểm tra','Trigger hiện thấy: '+r.triggerCount+' · hạn mức còn lại: '+r.quota+' người nhận. '+r.note,'success',11000);
 }).catch(e=>toastUpdate(loading,'Không kiểm tra được',e.message,'error',7000));
}
function showReminderTest(){confirmBox('Gửi email thử','Chỉ gửi 1 email thử đến địa chỉ đã liên kết với tài khoản của bạn. Không gửi cho toàn bộ nhân sự và không ghi nhận là kỳ nhắc chính thức.',async()=>{
 const wait=toast('Đang gửi thư thử','Chỉ thực hiện sau khi bạn xác nhận.','processing',0);
 try{const r=await gas('sendReminderEmailTest',{timeout:65000});toastUpdate(wait,'Đã gửi email thử','Đã gửi đến '+r.email+' với '+r.count+' nội dung.','success',7000);}
 catch(e){toastUpdate(wait,'Gửi thử thất bại',e.message,'error',7000);}
 });
}

/* CRUD Wizard chạy trong khối JS riêng: lỗi cú pháp ở đây không chặn core/đăng nhập */
'use strict';
function categoryModal(old=''){
  const group=APP.state.categoryGroup||Object.keys(APP.data.categories||{})[0];
  APP.state.form={mode:'category',group,value:old,old,step:1,values:[]};
  renderCategoryWizard();
}
function categoryValuesFromText(text){return String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);}
function categoryValidation(group,raw){
  const existing=new Set((APP.data.categories?.[group]||[]).map(norm)),seen=new Set(),issues=[];
  raw.forEach((v,i)=>{const nv=norm(v);if(existing.has(nv))issues.push('Dòng '+(i+1)+': đã có trong danh mục');
    if(seen.has(nv))issues.push('Dòng '+(i+1)+': bị trùng trong danh sách nhập');seen.add(nv);
    if(v.length>250)issues.push('Dòng '+(i+1)+': tối đa 250 ký tự');});
  if(raw.length>200)issues.push('Mỗi lượt tối đa 200 giá trị');
  if(!raw.length)issues.push('Vui lòng nhập ít nhất một giá trị');
  return issues;
}
function renderCategoryWizard(){
  const f=APP.state.form;if(f?.mode!=='category')return;
  if(f.old){
    modal('Sửa danh mục','Chỉnh sửa một giá trị danh mục đang chọn.',`<div class="form-grid"><div class="form-field full"><label>Nhóm danh mục</label><input readonly value="${att(f.group)}"></div><div class="form-field full"><label>Giá trị</label><input id="cat-value" value="${att(f.old)}"><div class="field-help">Không thể sửa giá trị đang được sử dụng trong nghiệp vụ.</div></div></div>`,`<button class="btn" data-action="close-modal">Hủy</button><button id="save-category" class="btn btn-primary" data-action="save-category">Lưu danh mục</button>`,'small');
    return;
  }
  let body='';
  if(f.step===1){body=`<div class="form-field"><label>Nhóm danh mục</label><input readonly value="${att(f.group)}"></div><div class="form-field" style="margin-top:15px"><label>Danh sách giá trị mới <span class="required">*</span></label><textarea id="cat-values-multi" class="category-multi-input" placeholder="Ví dụ:\nLễ cầu an\nLễ cầu siêu\nLễ Vu Lan">${esc(f.text||'')}</textarea><div class="field-help">Mỗi dòng tương ứng 1 giá trị. Bỏ qua dòng trống, kiểm tra trùng trước khi lưu; không cần thêm dấu phẩy.</div></div>`;}
  else{const issues=categoryValidation(f.group,f.values);body=`<div class="wizard-review-summary">${icon('fact_check')} <b>${f.values.length} giá trị</b> cần xác nhận · <b>${issues.length}</b> cảnh báo</div>${issues.length?`<div class="wizard-error-summary">${issues.map(esc).join('<br>')}</div>`:''}<div class="category-review-list">${f.values.map((v,i)=>`<div><b>${i+1}.</b> ${esc(v)}</div>`).join('')}</div>`;}
  modal('Thêm danh mục',`Nhóm: ${f.group} · Bước ${f.step}/2`,`<div class="workflow-steps v85-clickable-steps"><button type="button" data-v85-category-step="1" class="${f.step===1?'active':'complete'}">1. Nhập nhiều giá trị</button>${icon('chevron_right')}<button type="button" data-v85-category-step="2" class="${f.step===2?'active':''}">2. Kiểm tra</button></div>${body}`,
  f.step===1?`<button class="btn" data-action="close-modal">Hủy</button><button class="btn btn-primary" data-action="category-next">Tiếp tục kiểm tra ${icon('arrow_forward')}</button>`:
  `<button class="btn" data-action="category-back">${icon('arrow_back')} Quay lại</button><button id="save-category" class="btn btn-primary" data-action="save-category" ${categoryValidation(f.group,f.values).length?'disabled':''}>${icon('save')} Lưu ${f.values.length} giá trị</button>`,'wide');
}
function categoryNext(){const f=APP.state.form;if(!f||f.mode!=='category'||f.old)return;
  f.text=document.getElementById('cat-values-multi')?.value||'';f.values=categoryValuesFromText(f.text);
  const errors=categoryValidation(f.group,f.values);f.step=2;renderCategoryWizard();
  if(errors.length)toast('Có giá trị cần kiểm tra',errors.slice(0,4).join('; '),'warning',7000);}
async function saveCategory(){
 const f=APP.state.form;if(f?.mode!=='category')return;const btn=document.getElementById('save-category');
 if(f.old){const value=document.getElementById('cat-value')?.value.trim();if(!value)return toast('Thiếu giá trị','Hãy nhập giá trị danh mục.','warning');busy(btn,true);
   try{const r=await gas('saveCategoryValue',f.group,value,f.old,{timeout:60000});APP.data.categories=r.categories;closeModal();renderCategories();toast('Đã sửa danh mục',value);}
   catch(e){toast('Không thể sửa',e.message,'error',7000);busy(btn,false);}return;
 }
 if(f.step!==2)return;if(categoryValidation(f.group,f.values).length)return toast('Danh mục chưa hợp lệ','Quay lại kiểm tra danh sách.','warning');
 busy(btn,true);const t=toast('Đang thêm danh mục',f.values.length+' giá trị','processing',0);
 try{const r=await gas('saveCategoryValues',f.group,f.values,{timeout:90000});APP.data.categories=r.categories;closeModal();renderCategories();toastUpdate(t,'Thêm danh mục thành công',r.added+' giá trị đã được lưu.');}
 catch(e){toastUpdate(t,'Không thể thêm',e.message,'error',8000);busy(btn,false);}
}
async function deleteCategory(v){const group=APP.state.categoryGroup;confirmBox('Xóa danh mục',`Xóa "${v}" khỏi ${group}?`,async()=>{const t=toast('Đang xóa','Hệ thống kiểm tra các dữ liệu đang dùng...','processing',0);try{const r=await gas('deleteCategoryValue',group,v);APP.data.categories=r.categories;renderCategories();toastUpdate(t,'Đã xóa','Giá trị danh mục đã xóa.');}catch(e){toastUpdate(t,'Không thể xóa',e.message,'error',6000);}});}


/* -------- WIZARD THÊM MỚI CHUNG: 2 BƯỚC, THEO ĐÚNG SCHEMA -------- */
const WIZARD_MAX_ROWS=50;
const WIZARD_FILE_ACCEPT='image/png,image/jpeg,image/webp,image/gif,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt';
const WIZARD_MIME=/^(image\/(png|jpeg|webp|gif)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet)|vnd\.ms-excel)|text\/(plain|csv))$/i;
function newWizard(key,seed={}){
 const cfg=cfgOf(key);if(!cfg.fields||cfg.readOnly||!canWrite(key))return;
 APP.state.wizard={key,step:1,rows:[makeWizardRow(key,seed)],collapsed:new Set(),files:[[]],saving:false,dirty:false,tableMode:false};
 renderWizard();
}
function makeWizardRow(key,seed={}){
 const cfg=cfgOf(key),obj={};editableFields(key).forEach(f=>obj[f]=seed[f]??'');
 if(cfg.fields.includes('Trạng thái')&&!obj['Trạng thái'])obj['Trạng thái']=MODULE_STATE[key]?.[0]||'Hoạt động';
 if(cfg.fields.includes('Trạng thái điểm danh')&&!obj['Trạng thái điểm danh'])obj['Trạng thái điểm danh']='Có mặt';
 if(key==='fees'){obj['Học phí gốc']=obj['Học phí gốc']||0;obj['Miễn giảm']=obj['Miễn giảm']||0;obj['Phải thu']=Math.max(0,Number(obj['Học phí gốc'])-Number(obj['Miễn giảm']));}
 if((cfg.dates||[]).includes('Ngày tham gia')&&!obj['Ngày tham gia'])obj['Ngày tham gia']=displayDate(today());
 return obj;
}
function wizardRowIsBlank(key,row,files=[]){
 const ctx=APP.state.wizard?.key===key?APP.state.wizard.context:null;const initial=makeWizardRow(key,ctx?{[ctx.foreignKey]:ctx.sourceId}:{});return !(files||[]).length&&editableFields(key).every(f=>String(row[f]??'').trim()===String(initial[f]??'').trim());
}
function wizardFileArea(i){const w=APP.state.wizard;if(!APP.permissions.canUpload||w.key==='users')return '';
 const files=w.files[i]||[],split=window.chuaV86?.visualModules?.has(w.key);
 const imgFiles=files.filter(f=>f._chuaKind==='Ảnh').length,docFiles=files.length-imgFiles;
 const picker=(kind,multiple,title,symbol)=>`<button type="button" class="btn btn-sm" data-action="wizard-file-select" data-kind="${kind}" data-i="${i}" data-multiple="${multiple?'1':'0'}">${icon(symbol)} ${title}</button>`;
 const card=(symbol,title,subtitle,buttons)=>`<div class="v86-drop-card"><div class="v881-drop-card-heading"><span class="v881-media-icon">${icon(symbol)}</span><div><b>${title}</b><small>${subtitle}</small></div></div><div class="v86-upload-buttons">${buttons}</div></div>`;
 const imageCard=card('image','Ảnh hồ sơ',`${imgFiles} ảnh đã chọn · JPG, PNG, WebP, GIF`,picker('Ảnh',false,'1 ảnh','add_photo_alternate')+picker('Ảnh',true,'Nhiều ảnh','collections'));
 const documentCard=card('description',split?'Tài liệu liên quan':'Tài liệu đính kèm',`${docFiles} file đã chọn · PDF, Word, Excel, TXT, ảnh scan`,picker('Tài liệu liên quan',false,'1 file','attach_file')+picker('Tài liệu liên quan',true,'Nhiều file','drive_folder_upload'));
 return `<section class="wizard-attachment v881-upload-panel" aria-label="Đính kèm cho bản ghi ${i+1}"><div class="wizard-attachment-label">${icon('attach_file')} <strong>Ảnh & tài liệu đính kèm</strong><small class="v883-file-target">${esc(cfgOf(w.key).title)} · bản ghi ${i+1} (mã được tạo khi lưu)${w.context?` · Nguồn: ${esc(w.context.sourceName)} (${esc(w.context.sourceId)})`:''}</small><span class="v881-upload-count">${files.length}/10 file</span></div>
 <div class="v86-upload-grid ${split?'':'v881-doc-only'}">${split?imageCard:''}${documentCard}</div>
 ${files.length?`<div class="wizard-file-list v881-upload-files">${files.map((f,j)=>`<span class="wizard-file-pill">${icon(f._chuaKind==='Ảnh'?'image':'description')}<span class="v881-file-name" title="${att(f.name)}">${esc(f.name)}</span><button type="button" data-action="wizard-file-remove" data-i="${i}" data-file="${j}" aria-label="Bỏ file ${att(f.name)}">×</button></span>`).join('')}</div>`:''}
 <p class="v881-upload-note">Chọn thêm file nhiều lần · Tối đa 10 file/bản ghi, 12 MB/file · Chỉ upload sau khi lưu hồ sơ.</p></section>`;
}
function validateWizardRow(w,row,i){const errors=validateClient(w.key,row),cfg=cfgOf(w.key),unique=cfg.unique||[];
 if(unique.length&&unique.every(f=>String(row[f]??'').trim())){
  const signature=x=>unique.map(f=>String(x[f]??'').trim().toLowerCase()).join('\u001f');const value=signature(row);
  if(w.rows.some((other,j)=>j<i&&signature(other)===value))errors.push('Dòng trùng khóa nghiệp vụ ('+unique.join(', ')+')');
  if(dataOf(w.key).some(other=>signature(other)===value))errors.push('Dữ liệu đã tồn tại ('+unique.join(', ')+')');
 }
 return errors;}
function wizardRowCard(row,i){const w=APP.state.wizard,cfg=cfgOf(w.key),closed=w.collapsed.has(i),errors=validateWizardRow(w,row,i);
 const nameField=(cfg.required||[]).find(f=>f!==cfg.id&&row[f])||editableFields(w.key).find(f=>row[f]&&f!=='Trạng thái');
 const name=(nameField&&row[nameField])?String(row[nameField]):'Chưa nhập dữ liệu';
 const errorInfo=w.reviewed&&errors.length?`<div class="v883-row-errors">${icon('error_outline')} Dòng ${i+1}: ${errors.map(esc).join('; ')}</div>`:'';
 return `<section class="wizard-record ${closed?'is-collapsed':''}" data-wizard-record="${i}"><div class="wizard-record-header"><button class="wizard-record-title" type="button" data-action="wizard-toggle-row" data-i="${i}"><span class="wizard-number">${i+1}</span><span><b>Bản ghi ${i+1}</b><small>${esc(name).slice(0,90)}</small></span>${icon(closed?'expand_more':'expand_less')}</button><div class="wizard-record-actions"><button class="btn btn-sm" data-action="wizard-copy" data-i="${i}" title="Nhân bản">${icon('content_copy')}<span class="wizard-btn-label"> Nhân bản</span></button><button class="btn btn-sm btn-danger" data-action="wizard-remove" data-i="${i}" title="Xóa bản ghi">${icon('delete')}<span class="wizard-btn-label"> Xóa</span></button></div></div><div class="wizard-record-body">${window.chuaV85?.groupedFields?.(w.key,row,i)||`<div class="form-grid">${editableFields(w.key).map(f=>fieldInput(w.key,f,row[f]??'',{part:'grid',index:i})).join('')}</div>`}${wizardFileArea(i)}${errorInfo}</div></section>`;
}
const WIZARD_TABLE_FIELDS={memberships:['Mã người','Mã nhóm lớp','Ngày tham gia','Vai trò','Trạng thái'],attendance:['Mã buổi','Mã người','Trạng thái điểm danh','Mã nhân sự điểm danh','Ghi chú'],results:['Mã kỳ thi','Mã người','Điểm','Kết quả','Cấp đai'],fees:['Mã người','Mã nhóm lớp','Kỳ học phí','Học phí gốc','Miễn giảm']};
function changeWizardView(mode){const w=APP.state.wizard;if(!w||w.saving)return;w.tableMode=mode==='table'&&Boolean(WIZARD_TABLE_FIELDS[w.key]);renderWizard();}
function renderWizardTable(w){const fields=WIZARD_TABLE_FIELDS[w.key];return `<div class="v883-table-wrap"><table class="v883-bulk-table"><thead><tr><th>Dòng</th>${fields.map(f=>`<th>${esc(f)}${(cfgOf(w.key).required||[]).includes(f)?' *':''}</th>`).join('')}<th>Đính kèm</th><th>Thao tác</th></tr></thead><tbody>${w.rows.map((r,i)=>`<tr><td><b>${i+1}</b>${w.reviewed&&validateWizardRow(w,r,i).length?`<span class="v883-table-error" title="${att(validateWizardRow(w,r,i).join('; '))}">Lỗi dữ liệu</span>`:''}</td>${fields.map(f=>`<td>${fieldInput(w.key,f,r[f]??'',{part:'grid',index:i})}</td>`).join('')}<td><button class="btn btn-sm" type="button" data-action="wizard-file-select" data-i="${i}" data-multiple="1" data-kind="Tài liệu liên quan">${icon('attach_file')} ${w.files[i]?.length||0} file</button></td><td><div class="v883-row-buttons"><button class="btn btn-sm" type="button" data-action="wizard-copy" data-i="${i}" title="Nhân bản">${icon('content_copy')}</button><button class="btn btn-sm btn-danger" type="button" data-action="wizard-remove" data-i="${i}" title="Xóa dòng">${icon('delete')}</button></div></td></tr>`).join('')}</tbody></table><p class="field-help">Bảng nhập nhanh chỉ hiển thị các trường thường dùng. Chuyển sang “Từng hồ sơ” để xem toàn bộ trường, ảnh và tài liệu đã đính kèm.</p></div>`;}
function renderWizard(){const w=APP.state.wizard;if(!w)return;const cfg=cfgOf(w.key);
 const prevScroll=document.querySelector('#modal-root .v88-wizard-scroll');const scrollTop=prevScroll?.scrollTop||0;const prevStep=prevScroll?.dataset.wizardStep||'';
 const stepper=`${w.context?`<section class="v883-wizard-source">${icon('link')} <span>Thêm từ <b>${esc(w.context.sourceName)}</b> · ${esc(w.context.sourceId)} · ${esc(w.context.foreignKey)} được giữ cố định</span></section>`:''}<div class="workflow-steps v85-clickable-steps"><button type="button" data-v85-step="1" class="${w.step===1?'active':'complete'}">${icon('edit_note')} 1. Nhập liệu</button>${icon('chevron_right')}<button type="button" data-v85-step="2" class="${w.step===2?'active':''}">${icon('fact_check')} 2. Kiểm tra</button></div>`;
 let body='';
 if(w.step===1){body=`<div class="wizard-toolbar"><button class="btn btn-sm" data-action="wizard-add" data-count="1">${icon('add_circle')} Thêm 1 bản ghi</button><button class="btn btn-sm" data-action="wizard-add" data-count="5">${icon('playlist_add')} Thêm 5 bản ghi</button><button class="btn btn-sm" data-action="wizard-remove-blank">${icon('delete_sweep')} Xóa dòng trống</button><span class="wizard-toolbar-divider"></span><button class="btn btn-sm" data-action="wizard-collapse-all">${icon('unfold_less')} Thu gọn</button><button class="btn btn-sm" data-action="wizard-expand-all">${icon('unfold_more')} Mở rộng</button><span class="wizard-count">${w.rows.length}/${WIZARD_MAX_ROWS} bản ghi</span></div>${WIZARD_TABLE_FIELDS[w.key]&&w.rows.length>1?`<div class="v883-mode-switch"><button type="button" class="btn btn-sm ${w.tableMode?'':'is-active'}" data-action="v883-wizard-view" data-view="cards">${icon('badge')} Từng hồ sơ</button><button type="button" class="btn btn-sm ${w.tableMode?'is-active':''}" data-action="v883-wizard-view" data-view="table">${icon('table_rows')} Bảng nhập nhanh</button></div>`:''}<div class="wizard-record-list">${w.tableMode&&WIZARD_TABLE_FIELDS[w.key]&&w.rows.length>1?renderWizardTable(w):w.rows.map((r,i)=>wizardRowCard(r,i)).join('')}</div><p class="field-help">Có thể thêm nhiều hồ sơ, tìm mã liên kết bằng combobox và chuyển sang bước kiểm tra trước khi lưu. Không gọi Google Sheet khi thêm/xóa/thu gọn dòng.</p>`;}
 else{const all=w.rows.map((r,i)=>({index:i,errors:validateWizardRow(w,r,i)}));const bad=all.filter(x=>x.errors.length);
 body=`<div class="wizard-review-summary"><div><small>Tổng bản ghi</small><strong>${w.rows.length}</strong></div><div><small>Hợp lệ</small><strong>${all.length-bad.length}</strong></div><div><small>Cần bổ sung</small><strong class="${bad.length?'text-danger':''}">${bad.length}</strong></div></div>${bad.length?`<div class="wizard-error-summary">${bad.slice(0,15).map(x=>`<div>Dòng ${x.index+1}: ${esc(x.errors.join('; '))}</div>`).join('')}</div>`:''}<div class="wizard-review-list">${w.rows.map((r,i)=>`<section class="wizard-review-card"><div><span class="wizard-number">${i+1}</span><b>Bản ghi ${i+1}</b> ${all[i].errors.length?'<span class="badge badge-red">Cần kiểm tra</span>':'<span class="badge badge-green">Hợp lệ</span>'}</div><div class="wizard-review-fields">${editableFields(w.key).filter(f=>String(r[f]??'').trim()).map(f=>`<span><small>${esc(f)}</small><strong>${f==='Mật khẩu'?'••••••••':esc((cfg.refs||{})[f]?lookup(cfg.refs[f],r[f]):r[f])}</strong></span>`).join('')}</div>${w.files[i]?.length?`<p class="muted">${icon('attach_file')} ${w.files[i].length} file đính kèm chờ upload sau lưu</p>`:''}</section>`).join('')}</div>`;}
 const footer=w.step===1?`<button class="btn" data-action="close-modal">Hủy</button><button class="btn btn-primary" data-action="wizard-next">Tiếp tục kiểm tra ${icon('arrow_forward')}</button>`:`<button class="btn" data-action="wizard-back">${icon('arrow_back')} Quay lại nhập liệu</button><button id="wizard-save" class="btn btn-primary" data-action="wizard-save" ${w.saving||w.rows.some((r,i)=>validateWizardRow(w,r,i).length)?'disabled':''}>${icon('save')} Xác nhận lưu ${w.rows.length} bản ghi</button>`;
 modal(`Thêm ${cfg.title}`,`Wizard 2 bước · ${w.step===1?'Nhập liệu và đính kèm':'Kiểm tra trước khi ghi vào Google Sheet'}`,stepper+body,footer,'xwide');
 const shell=document.querySelector('#modal-root .modal');if(shell)shell.classList.add('v88-wizard-modal');
 const scroll=document.querySelector('#modal-root .modal-body');if(scroll){scroll.classList.add('v88-wizard-scroll');scroll.dataset.wizardStep=String(w.step);scroll.scrollTop=prevStep===String(w.step)?scrollTop:0;}
}
function wizardReindexCollapse(w,start,delta){const newSet=new Set();for(const idx of w.collapsed)newSet.add(idx<start?idx:idx+delta);w.collapsed=newSet;}
function wizardAdd(n){const w=APP.state.wizard;if(!w||w.saving)return;if(w.rows.length+n>WIZARD_MAX_ROWS)return toast('Đã đạt giới hạn','Tối đa 50 bản ghi mỗi lượt.','warning');
 for(let i=0;i<n;i++){w.rows.push(makeWizardRow(w.key,w.context?{[w.context.foreignKey]:w.context.sourceId}:{}));w.files.push([]);}w.dirty=true;renderWizard();}
function wizardCopy(i){const w=APP.state.wizard;if(!w||w.saving||w.rows.length>=WIZARD_MAX_ROWS)return;
 wizardReindexCollapse(w,i+1,1);w.rows.splice(i+1,0,{...w.rows[i]});w.files.splice(i+1,0,[]);w.dirty=true;renderWizard();}
function wizardRemove(i){const w=APP.state.wizard;if(!w||w.saving)return;
 if(w.rows.length===1){w.rows=[makeWizardRow(w.key,w.context?{[w.context.foreignKey]:w.context.sourceId}:{})];w.files=[[]];w.collapsed.clear();}else{w.rows.splice(i,1);w.files.splice(i,1);w.collapsed=new Set([...w.collapsed].filter(x=>x!==i).map(x=>x>i?x-1:x));}w.dirty=true;renderWizard();}
function wizardRemoveBlank(){const w=APP.state.wizard;if(!w||w.saving)return;
 const keep=w.rows.map((r,i)=>i).filter(i=>!wizardRowIsBlank(w.key,w.rows[i],w.files[i]));const removed=w.rows.length-keep.length;
 w.rows=keep.length?keep.map(i=>w.rows[i]):[makeWizardRow(w.key,w.context?{[w.context.foreignKey]:w.context.sourceId}:{})];w.files=keep.length?keep.map(i=>w.files[i]):[[]];w.collapsed.clear();if(removed)w.dirty=true;renderWizard();toast('Đã dọn dòng trống',removed+' bản ghi trống được xóa.');}
function wizardToggleRow(i){const w=APP.state.wizard;if(!w)return;w.collapsed.has(i)?w.collapsed.delete(i):w.collapsed.add(i);
 const node=document.querySelector('[data-wizard-record="'+i+'"]');node?.classList.toggle('is-collapsed',w.collapsed.has(i));const symbol=node?.querySelector('.wizard-record-title .material-symbols-rounded');if(symbol)symbol.textContent=w.collapsed.has(i)?'expand_more':'expand_less';}
function wizardCollapseAll(collapse){const w=APP.state.wizard;if(!w)return;w.collapsed=collapse?new Set(w.rows.map((_,i)=>i)):new Set();document.querySelectorAll('[data-wizard-record]').forEach((node)=>{const i=Number(node.dataset.wizardRecord);node.classList.toggle('is-collapsed',collapse);const symbol=node.querySelector('.wizard-record-title .material-symbols-rounded');if(symbol)symbol.textContent=collapse?'expand_more':'expand_less';});}
function wizardSelectFiles(i,multiple,kind='Tài liệu liên quan'){let input=document.createElement('input');input.type='file';input.accept=kind==='Ảnh'?'image/png,image/jpeg,image/webp,image/gif':WIZARD_FILE_ACCEPT;input.multiple=Boolean(multiple);input.style.display='none';document.body.appendChild(input);input.onchange=()=>{const f=[...input.files];f.forEach(file=>file._chuaKind=kind==='Ảnh'?'Ảnh':'Tài liệu liên quan');wizardAddFiles(i,f);input.remove();};input.click();}
function wizardAddFiles(i,newFiles){const w=APP.state.wizard;if(!w||!w.files[i])return;const existing=w.files[i];const signatures=new Set(existing.map(f=>f.name+'|'+f.size+'|'+f.lastModified));let skipped=0;
 for(const file of newFiles){const sig=file.name+'|'+file.size+'|'+file.lastModified;if(!file.size||file.size>12*1024*1024||!WIZARD_MIME.test(file.type)||signatures.has(sig)||existing.length>=10){skipped++;continue;}existing.push(file);signatures.add(sig);}
 if(newFiles.length>skipped)w.dirty=true;if(skipped)toast('Kiểm tra file',skipped+' file không hợp lệ/trùng, hoặc vượt giới hạn 10 file mỗi bản ghi.','warning',6000);renderWizard();}
function wizardRemoveFile(i,j){const w=APP.state.wizard;if(!w||!w.files[i])return;w.files[i].splice(j,1);w.dirty=true;renderWizard();}
function wizardNext(){const w=APP.state.wizard;if(!w||w.saving)return;
 // Chuyển bước tự do kể cả khi biểu mẫu trống; chỉ kiểm tra điều kiện bắt buộc khi lưu.
 w.reviewed=true;const errs=w.rows.flatMap((r,i)=>validateWizardRow(w,r,i).map(x=>`Bản ghi ${i+1}: ${x}`));
 // Client check repeated unique keys, backend vẫn kiểm tra khi lưu
 const cfg=cfgOf(w.key);
 w.step=2;renderWizard();if(errs.length)toast('Cần kiểm tra',errs.slice(0,4).join('; ')+'; vui lòng quay lại nhập liệu để sửa.','warning',8500);}
async function wizardBackgroundFiles(key,id,files){if(!files?.length)return {uploaded:0,errors:[]};let uploaded=0,errors=[];
 for(const file of files){try{const dataUrl=await localFileToDataUrl(file);const r=await gas('saveUploadedFile',{module:key,recordId:id,fileName:file.name,mimeType:file.type||'application/octet-stream',size:file.size,dataUrl,documentType:file._chuaKind||'Tài liệu liên quan'},{timeout:180000});
 if(r.file){mergeRow('files',r.file);}if(r.linked)mergeRow(key,r.linked);uploaded++;}catch(e){errors.push(file.name+': '+e.message);}}
 return {uploaded,errors};}
function scheduleWizardUploads(key,created,fileLists){
 const cfg=cfgOf(key),attachments=created.map((r,i)=>({id:r[cfg.id],files:fileLists[i]||[]})).filter(x=>x.id&&x.files.length);
 if(!attachments.length)return;
 const t=toast('Đang upload file','File được tải lên sau khi đã có mã hồ sơ. Bạn có thể tiếp tục thao tác.','processing',0);
 (async()=>{let success=0,errors=[];for(const a of attachments){const outcome=await wizardBackgroundFiles(key,a.id,a.files);success+=outcome.uploaded;errors.push(...outcome.errors);}
 if(APP.state.page===key||APP.state.page==='files')renderPage();
 toastUpdate(t,errors.length?'Upload chưa hoàn tất':'Upload hoàn tất',success+' file thành công.'+(errors.length?' '+errors.slice(0,2).join('; '):''),errors.length?'warning':'success',errors.length?12000:5000);
 })().catch(e=>toastUpdate(t,'Upload lỗi',e.message,'error',8000));
}
async function wizardSave(){const w=APP.state.wizard;if(!w||w.step!==2||w.saving)return;
 const errs=w.rows.flatMap((r,i)=>validateWizardRow(w,r,i).map(x=>`Dòng ${i+1}: ${x}`));if(errs.length)return toast('Dữ liệu không hợp lệ',errs.slice(0,5).join('; '),'error');
 w.saving=true;const btn=document.getElementById('wizard-save');busy(btn,true);const key=w.key,cfg=cfgOf(key),rows=w.rows.map(r=>({...r})),files=w.files.map(a=>[...a]);
 const t=toast('Đang lưu dữ liệu','Bắt đầu ghi '+rows.length+' bản ghi vào Google Sheet.','processing',0);
 let created=[],warnings=[],failed=null;
 const useBulk=Boolean(cfg.bulk)&&!BLOCKED_TRANSACTION_KEYS.has(key)&&key!=='users';
 if(useBulk){try{const r=await gas('saveBulkRecords',key,rows,{timeout:120000});created=r.rows||[];applyServerPatches(r.patches);warnings.push(...(r.warnings||[]));}
 catch(e){failed={index:0,error:e.message};}}
 else{for(let i=0;i<rows.length;i++){
 try{const result=await gas('saveRecord',key,rows[i],{timeout:90000});created.push(result.entry);applyServerPatches(result.patches);if(result.warning)warnings.push(result.warning);
 toastUpdate(t,'Đang lưu',`${i+1}/${rows.length} bản ghi đã xử lý`,'processing',0);
 }catch(e){failed={index:i,error:e.message};break;}}}
 created.forEach(r=>mergeRow(key,r));
 if(failed){w.saving=false;w.step=1;
  if(created.length){scheduleWizardUploads(key,created,files.slice(0,created.length));w.rows=w.rows.slice(created.length);w.files=w.files.slice(created.length);w.collapsed.clear();}
  renderWizard();if(created.length)renderPage();toastUpdate(t,'Lưu chưa hoàn tất',`Đã ghi ${created.length}/${rows.length} bản ghi. ${failed.error}. Những dòng đã lưu được loại khỏi Wizard để tránh ghi trùng; kiểm tra và lưu lại phần còn lại.`, 'warning',12000);
  return;}
 if(APP.state.wizardReturn){returnFromWizard();}else{closeModal();renderPage();}toastUpdate(t,'Đã lưu dữ liệu',`Đã lưu ${created.length} bản ghi. ${warnings.slice(0,2).join('; ')}`,warnings.length?'warning':'success',5500);
 scheduleWizardUploads(key,created,files);
}



/* Temple tone helper */
(function(){
  function applyTempleChartDefaults(){
    if(!window.Chart||window.__TEMPLE_CHARTS_APPLIED)return;
    window.__TEMPLE_CHARTS_APPLIED=true;
    Chart.defaults.color='#6a4631';
    Chart.defaults.borderColor='rgba(180,143,99,.25)';
    if(Chart.defaults.plugins&&Chart.defaults.plugins.legend&&Chart.defaults.plugins.legend.labels){
      Chart.defaults.plugins.legend.labels.color='#6a4631';
    }
    if(Chart.defaults.scale&&Chart.defaults.scale.grid){
      Chart.defaults.scale.grid.color='rgba(180,143,99,.15)';
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', applyTempleChartDefaults, {once:true});
  else applyTempleChartDefaults();
})();

window.__CHUA_FEATURE_READY=true;
/* DashboardInsights JavaScript (isolated execution, embedded in existing JavaScript.html) */
(function () {
  'use strict';
  // Feature isolation: a broken visualization must not prevent sign-in or CRUD.
  const S={taskFilter:'overdue',taskQuery:'',taskOwner:'',taskPage:1,taskSize:12};
  const COLORS=['#b98333','#388164','#b64c49','#4d80ae','#9165a2','#c4a57c'];
  const html=(v)=>esc(v==null?'':v), fmt=(v)=>new Intl.NumberFormat('vi-VN',{maximumFractionDigits:0}).format(Number(v)||0);
  const num=(v)=>{if(typeof v==='number')return Number.isFinite(v)?v:0;let t=String(v||'').trim();if(/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t))t=t.replace(/\./g,'').replace(',','.');else t=t.replace(',','.');return Number(t)||0;};
  const rows=(k)=>canRead(k)?dataOf(k):[];
  const ymd=(d)=>d instanceof Date&&!isNaN(d.getTime())?new Date(d.getFullYear(),d.getMonth(),d.getDate()):null;
  const date=(x)=>ymd(parseDate(x));
  const inPeriod=(x)=>{const d=date(x),p=APP.state.period||{};return !!(d&&p.from&&p.to&&d>=ymd(p.from)&&d<=ymd(p.to));};
  const anchor=()=>{const p=APP.state.period||{};const d=date(p.to);return d||today();};
  const monthKey=(d)=>d?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`:'';
  const months=()=>{let d=anchor(),a=[];for(let i=5;i>=0;i--){let v=new Date(d.getFullYear(),d.getMonth()-i,1);a.push({key:monthKey(v),label:String(v.getMonth()+1).padStart(2,'0')+'/'+String(v.getFullYear()).slice(-2)});}return a;};
  const activeTask=(r)=>!['Hoàn thành','Đã hủy','Kết thúc'].includes(String(r['Trạng thái']||''));
  const overdue=(r)=>activeTask(r)&&!!date(r['Ngày hạn'])&&date(r['Ngày hạn'])<today();
  const upcoming=(r)=>{let d=date(r['Ngày hạn']),now=today();return activeTask(r)&&!!d&&d>=now&&d<=new Date(+now+7*86400000);};
  const awaiting=(r)=>activeTask(r)&&/Chờ xác nhận|Chờ duyệt/i.test(String(r['Trạng thái']||''));
  const inProgress=(r)=>activeTask(r)&&/Đang thực hiện|Đang xử lý/i.test(String(r['Trạng thái']||''));
  const finance=()=>rows('finance').filter(r=>r['Trạng thái']==='Đã xác nhận'&&['Thu','Chi'].includes(String(r['Loại giao dịch'])));
  const money=(n)=>fmt(n)+' ₫';
  const pill=(status)=>{const s=String(status||'Chưa xác định');const tone=/Hoàn thành|Đã xác nhận|Đã thu|Đã xử lý/.test(s)?'green':/Quá hạn|Hủy|Khẩn/.test(s)?'red':/Đang/.test(s)?'blue':/Chờ|Dự kiến|Nháp/.test(s)?'gold':'';return `<span class="ti-pill ${tone}">${html(s)}</span>`;};
  const section=(title,ic,right='')=>`<div class="ti-section-title"><h2><span class="material-symbols-rounded">${ic}</span>${html(title)}</h2>${right?`<span>${right}</span>`:''}</div>`;
  const kpi=(label,value,desc,ico,tone,page)=>{const link=page&&canPage(page);return `<${link?'button':'div'} ${link?`data-page="${page}" type="button"`:''} class="ti-kpi ${tone||''} ${link?'ti-link':''}" style="text-align:left;color:inherit">${link?'<span class="material-symbols-rounded ti-next">arrow_outward</span>':''}<span class="ti-kpi-symbol"><span class="material-symbols-rounded">${ico}</span></span><span><small>${html(label)}</small><strong>${html(value)}</strong><p>${html(desc||'')}</p></span></${link?'button':'div'}>`;};
  const safeChart=(v)=>Number.isFinite(v)?v:0;
  function barChart(items,keys,colors){
    const w=660,h=225,L=51,R=14,T=19,B=33,plotW=w-L-R,plotH=h-T-B;
    let high=Math.max(1,...items.flatMap(it=>keys.map(k=>safeChart(num(it[k])))));
    let y=(v)=>T+plotH-(num(v)/high)*plotH;
    let svg=`<svg role="img" aria-label="Biểu đồ cột theo tháng" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">`;
    for(let n=0;n<=4;n++){let v=high*n/4,yy=y(v);svg+=`<line x1="${L}" y1="${yy}" x2="${w-R}" y2="${yy}" stroke="#eadac5" stroke-dasharray="3 4"/><text x="${L-8}" y="${yy+4}" text-anchor="end">${html(v>=1000000?(v/1000000).toFixed(1)+'tr':v>=1000?(v/1000).toFixed(0)+'k':Math.round(v))}</text>`;}
    const step=plotW/Math.max(1,items.length),inner=Math.min(step*.58,58),bw=inner/keys.length;
    items.forEach((it,i)=>{let x=L+i*step+step/2;keys.forEach((k,j)=>{let v=Math.max(0,num(it[k])),hh=Math.max(0,plotH*(v/high)),xx=x-inner/2+j*bw;svg+=`<rect x="${xx.toFixed(1)}" y="${(T+plotH-hh).toFixed(1)}" width="${Math.max(4,bw-3).toFixed(1)}" height="${hh.toFixed(1)}" rx="4" fill="${colors[j%colors.length]}"><title>${html(it.label)} · ${html(k)}: ${fmt(v)}</title></rect>`;});svg+=`<text class="ti-chart-label" x="${x.toFixed(1)}" y="${h-9}" text-anchor="middle">${html(it.label)}</text>`;});
    return svg+'</svg>';
  }
  function donutChart(arr,center,caption){
    const vals=arr.map(a=>Math.max(0,num(a.value))),total=vals.reduce((a,b)=>a+b,0);let start=0,svg=`<svg viewBox="0 0 140 140" role="img" aria-label="Biểu đồ tỷ lệ"><circle cx="70" cy="70" r="51" stroke="#f0e1cc" stroke-width="18" fill="none"/>`;
    const perimeter=2*Math.PI*51;
    vals.forEach((v,i)=>{if(!total||!v)return;const length=(v/total)*perimeter;svg+=`<circle cx="70" cy="70" r="51" stroke="${arr[i].color||COLORS[i%COLORS.length]}" stroke-width="18" fill="none" stroke-dasharray="${length.toFixed(2)} ${(perimeter-length).toFixed(2)}" stroke-dashoffset="${(-start).toFixed(2)}" transform="rotate(-90 70 70)"/>`;start+=length;});
    svg+=`<text x="70" y="72" text-anchor="middle">${html(center==null?fmt(total):center)}</text><text class="ring-sub" x="70" y="87" text-anchor="middle">${html(caption||'Tổng cộng')}</text></svg>`;
    const legend=`<div class="ti-ring-legend">${arr.map((a,i)=>`<div><i style="background:${a.color||COLORS[i%COLORS.length]}"></i><span>${html(a.label)}</span><b>${fmt(a.value)}</b></div>`).join('')}</div>`;
    return `<div class="ti-donut-layout"><div class="ti-ring">${svg}</div>${legend}</div>`;
  }
  function taskStat(){const tasks=rows('tasks');return {all:tasks,over:tasks.filter(overdue),soon:tasks.filter(upcoming),waiting:tasks.filter(awaiting),working:tasks.filter(inProgress),done:tasks.filter(t=>String(t['Trạng thái'])==='Hoàn thành')};}
  const taskTitle=(r)=>String(r['Tiêu đề']||r['Nội dung']||r['Mã công việc']||'Chưa có tiêu đề');
  function dateDistance(r){const d=date(r['Ngày hạn']);if(!d)return {label:'Chưa có hạn',tone:''};const n=Math.round((d-today())/86400000);return n<0?{label:`Quá ${-n} ngày`,tone:'red'}:n===0?{label:'Đến hạn hôm nay',tone:'gold'}:{label:`Còn ${n} ngày`,tone:n<=7?'gold':''};}
  const empName=(r)=>{let v=r['Mã nhân sự phụ trách'];return v?String(lookup('employees',v)||v):'Chưa phân công';};
  function taskRowsTable(data,limit){const set=limit?data.slice(0,limit):data;if(!set.length)return `<div class="ti-empty"><span class="material-symbols-rounded">task_alt</span>Không có công việc phù hợp.</div>`;return `<div class="ti-table-wrap"><table class="ti-table"><thead><tr><th>Mã công việc</th><th>Nội dung</th><th>Người phụ trách</th><th>Ngày hạn</th><th>Thời hạn</th><th>Trạng thái</th><th></th></tr></thead><tbody>${set.map(r=>{let d=dateDistance(r);return `<tr><td><strong>${html(r['Mã công việc'])}</strong></td><td><strong>${html(taskTitle(r))}</strong><small>${html(r['Nhóm việc']||r['Mức ưu tiên']||'Công việc')}</small></td><td>${html(empName(r))}</td><td>${date(r['Ngày hạn'])?html(displayDate(r['Ngày hạn'])):'—'}</td><td><span class="ti-pill ${d.tone}">${html(d.label)}</span></td><td>${pill(r['Trạng thái'])}</td><td><button type="button" class="ti-btn" data-action="view-row" data-module="tasks" data-id="${att(r['Mã công việc'])}">Xem</button></td></tr>`;}).join('')}</tbody></table></div>`;}
  function readyRows(){return rows('events').filter(r=>!['Đã hủy'].includes(String(r['Trạng thái']))&&date(r['Ngày dương lịch'])&&date(r['Ngày dương lịch'])>=today()).sort((a,b)=>date(a['Ngày dương lịch'])-date(b['Ngày dương lịch'])).slice(0,5);}
  // ONE dashboard renderer: replaces the legacy KPI/dashboard + added reports combination.
  let premiumTab='overview';
  const PD_COLORS=['#962f29','#c58e3d','#33886e','#e27c49','#9b755b'];
  // Inline icons for Dashboard: avoid Material Symbols font failure or raw icon names.
  function pdIcon(name){
    const drawings={
      bar_chart:'<path d="M4 20V12M10 20V6M16 20v-9M22 20V3"/>',
      bar_chart_off:'<path d="M4 17v3m6-9v9m6-5v5M22 6v14M3 3l18 18"/>',
      monitoring:'<path d="M3 20V10M9 20V5M15 20v-8M21 20V3M3 20h18"/>',
      groups:'<circle cx="9" cy="8" r="3"/><path d="M2 21v-2a6 6 0 0 1 12 0v2M17 10a3 3 0 1 0-1-6M17 15a5 5 0 0 1 5 5v1"/>',
      diversity_3:'<circle cx="9" cy="8" r="3"/><path d="M2 21v-2a6 6 0 0 1 12 0v2M17 10a3 3 0 1 0-1-6M17 15a5 5 0 0 1 5 5v1"/>',
      school:'<path d="m2 9 10-5 10 5-10 5L2 9ZM5 11v7c4 3 10 3 14 0v-7M22 9v8"/>',
      calendar_month:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2M8 18h2"/>',
      event:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h8M8 17h5"/>',
      celebration:'<path d="M5 21 19 7M14 5l1 3M21 11l-3-1M6 4l2 2M4 12l3 1M12 21l-1-3"/>',
      assignment_late:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4.5h6v-2H9v2ZM12 9v5M12 18h.01"/>',
      task:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 12 2.5 2.5L16 9"/>',
      schedule:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
      payments:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 9h1M18 15h1"/>',
      account_balance_wallet:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M16 13h3"/>',
      account_balance:'<path d="M3 10h18M5 10v9M10 10v9M15 10v9M20 10v9M2 21h20M2 8l10-5 10 5H2Z"/>',
      currency_exchange:'<path d="M3 8h15l-4-4m4 4-4 4M21 16H6l4-4m-4 4 4 4"/>',
      wallet:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M16 13h3"/>',
      request_quote:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 13h4M9 17h6"/>',
      inventory_2:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M10 14h4"/>',
      inventory:'<path d="m3 7 9-4 9 4v11l-9 4-9-4V7ZM3 7l9 4 9-4M12 11v11"/>',
      warehouse:'<path d="m2 10 10-7 10 7v11H2V10ZM7 21v-9h10v9"/>',
      devices:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
      construction:'<path d="m14 7 3 3M7 14l3 3M4 20l7-7 4 4-7 7-4-4ZM14 3l7 7M10 7l7 7"/>',
      move_to_inbox:'<path d="M3 4h18v12l-3 5H6l-3-5V4ZM3 14h6l2 3h2l2-3h6"/>',
      shopping_cart:'<circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 3h2l3 13h13l2-9H5"/>',
      shopping_bag:'<rect x="4" y="7" width="16" height="14" rx="2"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
      receipt_long:'<path d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-2V3ZM9 8h6M9 12h6M9 16h4"/>',
      temple_buddhist:'<path d="M2 11h20M4 11v9M10 11v9M14 11v9M20 11v9M2 21h20M5 8l7-5 7 5H5Z"/>',
      grid_view:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      folder_shared:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3V7Z"/><path d="M8 15h8"/>',
      check_circle:'<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
      history:'<path d="M3 8V3m0 5h5M3 8a9 9 0 1 1-1 7M12 7v6l4 2"/>',
      lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
      how_to_reg:'<rect x="4" y="4" width="16" height="17" rx="2"/><path d="M8 10h7m-7 4 2 2 5-5"/>',
      workspace_premium:'<circle cx="12" cy="10" r="7"/><path d="m8 16-1 7 5-3 5 3-1-7"/>',
      military_tech:'<circle cx="12" cy="9" r="5"/><path d="M9 14 7 22l5-3 5 3-2-8"/>',
      show_chart:'<path d="M2 18 9 11l4 4 9-11"/>',
      stacked_bar_chart:'<path d="M4 20V7h4v13M10 20V3h4v17M16 20v-9h4v9"/>',
      donut_large:'<circle cx="12" cy="12" r="9"/><path d="M12 3v9l7 6"/>',
      verified_user:'<path d="M12 2 20 6v7c0 5-3 8-8 9-5-1-8-4-8-9V6l8-4ZM9 12l2 2 4-4"/>',
      support_agent:'<circle cx="12" cy="10" r="4"/><path d="M5 18a7 7 0 0 1 14 0M4 10v4M20 10v4"/>',
      trending_up:'<path d="m2 17 7-7 4 4 9-9M16 5h6v6"/>',
      autorenew:'<path d="M20 7V3h-4M20 7a9 9 0 0 0-16 0M4 17v4h4M4 17a9 9 0 0 0 16 0"/>',
      notifications_active:'<path d="M6 9a6 6 0 0 1 12 0v4l2 4H4l2-4V9ZM10 21h4"/>',
      arrow_forward:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
      chevron_right:'<path d="m9 6 6 6-6 6"/>',
      inbox:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 12h5l2 3h4l2-3h5"/>',
      assignment:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4.5h6v-2H9v2ZM9 10h6M9 14h6"/>'
    };
    return `<svg class="pd-icon-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${drawings[name]||drawings.bar_chart}</svg>`;
  }

  const pdAll=k=>canRead(k)?dataOf(k):[];
  const pdPeriod=(r,field)=>inPeriod(r[field]);
  const pdNm=(v)=>html(v||'—');
  const pdMoney=(v)=>fmt(v)+' đ';
  const pdPeriodRows=(key,field)=>pdAll(key).filter(r=>pdPeriod(r,field));
  const pdMonthRows=(key,field,filter)=>{const six=months(),out=six.map(m=>({label:m.label,key:m.key,count:0}));const byKey=new Map(out.map(r=>[r.key,r]));pdAll(key).forEach(r=>{if(filter&&!filter(r))return;const found=byKey.get(monthKey(date(r[field])));if(found)found.count++;});return out;};
  const pdMoneyRows=(key,field,amount,filter)=>{const out=months().map(m=>({label:m.label,key:m.key,value:0})),map=new Map(out.map(r=>[r.key,r]));pdAll(key).forEach(r=>{if(filter&&!filter(r))return;const found=map.get(monthKey(date(r[field])));if(found)found.value+=num(r[amount]);});return out;};
  const pdStatus=(items,field='Trạng thái')=>{const groups=new Map();items.forEach(r=>{const state=String(r[field]||'Chưa xác định');groups.set(state,(groups.get(state)||0)+1);});return [...groups].map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value);};
  const pdAccess=k=>canRead(k);
  const pdFmtAxis=(n,unit)=>unit==='money'?(n>=1e9?(n/1e9).toFixed(1)+' tỷ':n>=1e6?(n/1e6).toFixed(1)+' tr':n>=1000?Math.round(n/1000)+'k':String(Math.round(n))):n>=1000?(n/1000).toFixed(1)+'k':String(Math.round(n));
  function pdPanel(title,ico,content,note=''){
    return `<section class="pd-panel"><div class="pd-panel-head"><h2>${pdIcon(ico)}${html(title)}</h2>${note?`<span>${html(note)}</span>`:''}</div>${content}</section>`;
  }
  function pdEmpty(what){return `<div class="pd-empty">${pdIcon('bar_chart_off')}<strong>Chưa có dữ liệu ${html(what||'trong kỳ')}</strong><small>Biểu đồ sẽ được cập nhật từ hồ sơ thực tế khi có dữ liệu phù hợp.</small></div>`;}
  function pdLegend(series){return `<div class="pd-legend">${series.map((s,i)=>`<span><i style="background:${s.color||PD_COLORS[i%PD_COLORS.length]}"></i>${html(s.label)}</span>`).join('')}</div>`;}
  function pdBarsChart(dataset,series,unit='count',title='Biểu đồ theo tháng'){
    if(!dataset.length||!dataset.some(r=>series.some(s=>num(r[s.key])>0)))return pdEmpty('theo tháng');
    const W=740,H=270,L=63,R=17,T=19,B=38,PW=W-L-R,PH=H-T-B,maximum=Math.max(1,...dataset.flatMap(r=>series.map(s=>num(r[s.key])))),max=maximum*1.12;
    let svg=`<svg class="pd-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${att(title)}">`;
    for(let tick=0;tick<=4;tick++){const value=max*tick/4,y=T+PH-(PH*tick/4);svg+=`<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="#e9e0d4"/><text x="${L-10}" y="${y+4}" text-anchor="end" class="pd-axis">${pdFmtAxis(value,unit)}</text>`;}
    const step=PW/dataset.length,total=Math.min(step*.71,80),space=total/series.length;
    dataset.forEach((r,i)=>{const x=L+step*i+step/2;series.forEach((s,j)=>{const v=Math.max(0,num(r[s.key])),height=PH*v/max,xx=x-total/2+j*space+1;svg+=`<rect x="${xx.toFixed(1)}" y="${(T+PH-height).toFixed(1)}" width="${Math.max(5,space-4).toFixed(1)}" height="${height.toFixed(1)}" rx="3.5" fill="${s.color||PD_COLORS[j%PD_COLORS.length]}"><title>${html(r.label)} · ${html(s.label)}: ${html(unit==='money'?pdMoney(v):fmt(v))}</title></rect>`;});svg+=`<text class="pd-axis" text-anchor="middle" x="${x.toFixed(1)}" y="${H-11}">${html(r.label)}</text>`;});
    return pdLegend(series)+`<div class="pd-chart-canvas">${svg}</svg></div>`;
  }
  function pdMixedChart(rows,first,second){
    if(!rows.length||!rows.some(r=>num(r[first.key])>0||num(r[second.key])>0))return pdEmpty('sự kiện và tiếp nhận');
    const W=740,H=270,L=53,R=17,T=20,B=39,PW=W-L-R,PH=H-T-B,max=Math.max(1,...rows.flatMap(r=>[num(r[first.key]),num(r[second.key])]))*1.12,step=PW/rows.length;
    let svg=`<svg class="pd-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="So sánh số lượng sự kiện và tiếp nhận">`;
    for(let t=0;t<=4;t++){const y=T+PH-t*PH/4;svg+=`<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="#e9e0d4"/><text x="${L-9}" y="${y+4}" text-anchor="end" class="pd-axis">${pdFmtAxis(max*t/4)}</text>`;}
    let points=[];rows.forEach((r,i)=>{const x=L+step*(i+.5),height=PH*num(r[first.key])/max,y=T+PH-height,ly=T+PH-PH*num(r[second.key])/max;svg+=`<rect x="${(x-18).toFixed(1)}" y="${y.toFixed(1)}" width="36" height="${height.toFixed(1)}" rx="4" fill="${first.color}"><title>${html(r.label)} · ${html(first.label)}: ${fmt(r[first.key])}</title></rect><text class="pd-axis" text-anchor="middle" x="${x.toFixed(1)}" y="${H-11}">${html(r.label)}</text>`;points.push([x,ly]);});
    svg+=`<polyline points="${points.map(a=>a.map(n=>n.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${second.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    points.forEach((p,i)=>svg+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="5" fill="#fffaf3" stroke="${second.color}" stroke-width="2.4"><title>${html(rows[i].label)} · ${html(second.label)}: ${fmt(rows[i][second.key])}</title></circle>`);
    return pdLegend([first,second])+`<div class="pd-chart-canvas">${svg}</svg></div>`;
  }
  function pdDonut(dataset,title='Tổng cộng'){
    const values=dataset.filter(item=>num(item.value)>0),total=values.reduce((s,r)=>s+num(r.value),0);
    if(!total)return pdEmpty('theo trạng thái');
    const radius=73,circumference=2*Math.PI*radius;let offset=0;
    const arcs=values.map((r,i)=>{const portion=num(r.value)/total,len=circumference*portion;const part=`<circle cx="112" cy="112" r="${radius}" fill="none" stroke="${r.color||PD_COLORS[i%PD_COLORS.length]}" stroke-width="34" stroke-dasharray="${len.toFixed(3)} ${(circumference-len).toFixed(3)}" stroke-dashoffset="${(-offset).toFixed(3)}" transform="rotate(-90 112 112)"><title>${html(r.label)}: ${fmt(r.value)} (${Math.round(portion*100)}%)</title></circle>`;offset+=len;return part;}).join('');
    return `<div class="pd-donut-layout"><div class="pd-donut-wrap"><svg viewBox="0 0 224 224" role="img" aria-label="Cơ cấu ${att(title)}"><circle cx="112" cy="112" r="${radius}" fill="none" stroke="#f0e2d1" stroke-width="34"/>${arcs}<text class="pd-donut-number" x="112" y="112" text-anchor="middle">${fmt(total)}</text><text class="pd-donut-caption" x="112" y="130" text-anchor="middle">${html(title)}</text></svg></div><div class="pd-donut-legend">${values.map((r,i)=>`<div><i style="background:${r.color||PD_COLORS[i%PD_COLORS.length]}"></i><span>${html(r.label)}</span><strong>${fmt(r.value)} <small>(${Math.round(num(r.value)*100/total)}%)</small></strong></div>`).join('')}</div></div>`;
  }
  function pdRank(items,title='Dữ liệu'){
    const vals=items.slice(0,6),max=Math.max(1,...vals.map(r=>num(r.value)));
    if(!vals.some(r=>num(r.value)>0))return pdEmpty(title);
    return `<div class="pd-rank-list">${vals.map((r,i)=>`<div class="pd-rank-row"><span class="pd-rank-label" title="${att(r.label)}">${html(r.label)}</span><div class="pd-rank-track"><span style="width:${(num(r.value)/max*100).toFixed(1)}%;background:${PD_COLORS[i%PD_COLORS.length]}"></span></div><strong>${r.display?html(r.display):fmt(r.value)}</strong></div>`).join('')}</div>`;
  }
  function pdKpis(kpis){
    const authorized=kpis.filter(x=>!x[5]||pdAccess(x[5]));
    if(!authorized.length)return `<div class="pd-empty">Không có chỉ số được cấp quyền.</div>`;
    return `<div class="pd-kpi-grid">${authorized.map((x,i)=>{const [label,value,info,ico,tone,module]=x,click=module&&canPage(module);return `<${click?'button':'div'} ${click?`type="button" data-page="${att(module)}"`:''} class="pd-kpi pd-kpi-${tone||'gold'}"><span class="pd-kpi-icon">${pdIcon(ico)}</span><span class="pd-kpi-copy"><small>${html(label)}</small><strong>${html(value)}</strong><em>${html(info||'')}</em></span></${click?'button':'div'}>`;}).join('')}</div>`;
  }
  function pdTable(title,fields,rows,ico='table_rows',module='',actionLabel='Xem tất cả'){
    const button=module&&canPage(module)?`<button class="pd-panel-link" type="button" data-page="${att(module)}">${html(actionLabel)} ${pdIcon('arrow_forward')}</button>`:'';
    const content=rows.length?`<div class="pd-table-scroll"><table class="pd-table"><thead><tr>${fields.map(f=>`<th>${html(f)}</th>`).join('')}</tr></thead><tbody>${rows.slice(0,7).map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:`<div class="pd-empty pd-empty-small">${pdIcon('inbox')} Chưa có bản ghi phù hợp.</div>`;
    return `<section class="pd-panel pd-bottom-main"><div class="pd-panel-head"><h2>${pdIcon(ico)}${html(title)}</h2>${button}</div>${content}</section>`;
  }
  function pdPreviewList(title,ico,items,module=''){
    const button=module&&canPage(module)?`<button class="pd-panel-link" type="button" data-page="${att(module)}">Xem tất cả ${pdIcon('arrow_forward')}</button>`:'';
    return `<section class="pd-panel pd-bottom-side"><div class="pd-panel-head"><h2>${pdIcon(ico)}${html(title)}</h2>${button}</div><div class="pd-mini-list">${items.length?items.slice(0,4).map(item=>`<${item.key&&item.module?'button':'div'} ${item.key&&item.module?`type="button" data-action="view-row" data-module="${att(item.module)}" data-id="${att(item.key)}"`:''} class="pd-mini-item"><span class="pd-mini-date"><strong>${html(item.date1)}</strong><small>${html(item.date2)}</small></span><span class="pd-mini-copy"><strong>${html(item.title)}</strong><small>${html(item.detail)}</small></span>${pdIcon('chevron_right')}</${item.key&&item.module?'button':'div'}>`).join(''):`<div class="pd-empty pd-empty-small">Chưa có mục nào trong danh sách.</div>`}</div></section>`;
  }
  const pdDateBadge=(r,key)=>{const d=date(r[key]);return d?{date1:String(d.getDate()).padStart(2,'0'),date2:'Th '+(d.getMonth()+1)}:{date1:'--',date2:'--'};};
  const pdTextCell=(v)=>html(v||'—');
  const pdTaskRows=(rs)=>rs.slice(0,7).map(r=>[ `<strong>${html(r['Mã công việc'])}</strong>`, `<strong>${html(taskTitle(r))}</strong>`,pdTextCell(empName(r)),pdTextCell(displayDate(r['Ngày hạn'])),pill(overdue(r)?'Quá hạn':r['Trạng thái']),pill(r['Mức ưu tiên']||'Bình thường') ]);
  const pdMainTasks=()=>pdAll('tasks').slice().filter(r=>!['Đã hủy'].includes(String(r['Trạng thái']))).sort((a,b)=>((overdue(a)?0:1)-(overdue(b)?0:1))||((date(a['Ngày hạn'])||Infinity)-(date(b['Ngày hạn'])||Infinity))).slice(0,7);
  function pdBuildData(tab){
    const t=pdAll('tasks'),p=pdAll('people'),classes=pdAll('classes'),sessions=pdAll('sessions'),events=pdAll('events'),fees=pdAll('fees'),funds=pdAll('finance'),intakes=pdAll('intakes'),slots=pdAll('slots'),mem=pdAll('memorials');
    const assigned=t.filter(r=>r['Trạng thái']!=='Đã hủy'),due=t.filter(overdue),soonEvents=events.filter(r=>!['Đã hủy','Hoàn thành'].includes(String(r['Trạng thái']))&&date(r['Ngày dương lịch'])>=today()&&date(r['Ngày dương lịch'])<=new Date(+today()+30*86400000));
    const peopleActive=p.filter(r=>r['Trạng thái']!=='Tạm ngừng').length,feesTotal=fees.reduce((s,r)=>s+num(r['Phải thu']),0),sessionsPeriod=sessions.filter(r=>inPeriod(r['Ngày sinh hoạt'])&&!['Đã hủy'].includes(r['Trạng thái']));
    const monthset=months(),time=monthset.map(m=>({key:m.key,label:m.label,sessions:0,events:0,intakes:0,people:0})),timeIdx=new Map(time.map(m=>[m.key,m]));
    [['sessions','Ngày sinh hoạt','sessions'],['events','Ngày dương lịch','events'],['intakes','Ngày tiếp nhận','intakes'],['memberships','Ngày tham gia','people']].forEach(([key,field,name])=>pdAll(key).forEach(r=>{if(r['Trạng thái']==='Đã hủy')return;const x=timeIdx.get(monthKey(date(r[field])));if(x)x[name]++;}));
    const payments=monthset.map(m=>({key:m.key,label:m.label,thu:0,chi:0,congduc:0})),paymentIdx=new Map(payments.map(m=>[m.key,m]));funds.filter(r=>r['Trạng thái']==='Đã xác nhận').forEach(r=>{const m=paymentIdx.get(monthKey(date(r['Ngày giao dịch'])));if(!m)return;const amount=num(r['Số tiền']);if(r['Loại giao dịch']==='Thu'){m.thu+=amount;if(/cong duc|cúng dường/.test(norm(r['Nhóm thu chi']||'')))m.congduc+=amount;}if(r['Loại giao dịch']==='Chi')m.chi+=amount;});
    const taskStates=t.filter(r=>r['Trạng thái']!=='Đã hủy'),completed=taskStates.filter(r=>r['Trạng thái']==='Hoàn thành').length,overdueCount=taskStates.filter(overdue).length;
    const inWork=taskStates.filter(r=>!overdue(r)&&['Đang thực hiện','Đang xử lý'].includes(r['Trạng thái'])).length;
    const waiting=Math.max(0,taskStates.length-completed-overdueCount-inWork);
    // Exclusive categories; overdue is prioritized over other unfinished states.
    const donutTasks=[{label:'Hoàn thành',value:completed,color:'#33886e'},{label:'Đang thực hiện',value:inWork,color:'#c58e3d'},{label:'Chờ xử lý',value:waiting,color:'#df7a48'},{label:'Quá hạn',value:overdueCount,color:'#b44840'}];
    const monthsFinance=monthset.map(m=>({label:m.label,thu:0,hoan:0})),recMap=new Map(monthsFinance.map(m=>[m.label,m]));
    pdAll('feeReceipts').filter(r=>r['Trạng thái']==='Đã xác nhận').forEach(r=>{const mo=recMap.get(monthset.find(m=>m.key===monthKey(date(r['Ngày thu'])))?.label);if(mo)mo.thu+=num(r['Số tiền']);});
    pdAll('feeRefunds').filter(r=>r['Trạng thái']==='Đã duyệt').forEach(r=>{const mo=recMap.get(monthset.find(m=>m.key===monthKey(date(r['Ngày đề nghị'])))?.label);if(mo)mo.hoan+=num(r['Số tiền hoàn']);});
    const stockMonth=monthset.map(m=>({label:m.label,key:m.key,nhap:0,xuat:0})),stockIdx=new Map(stockMonth.map(m=>[m.key,m]));pdAll('stockLedger').forEach(r=>{const found=stockIdx.get(monthKey(date(r['Ngày giao dịch'])));if(found){found.nhap+=num(r['Số lượng nhập']);found.xuat+=num(r['Số lượng xuất']);}});
    const memMonth=pdMonthRows('memorials','Ngày tiếp nhận'),eventsCards=soonEvents.sort((a,b)=>date(a['Ngày dương lịch'])-date(b['Ngày dương lịch']));
    let kpis=[],charts=[],bottom=[];
    const pdTaskChart=()=>pdPanel('Cơ cấu công việc theo trạng thái','donut_large',pdDonut(donutTasks,'công việc'),'Phân loại không chồng lặp');
    const pdActivities=()=>pdPanel('Xu hướng hoạt động 6 tháng','monitoring',pdBarsChart(time,[{key:'sessions',label:'Buổi sinh hoạt',color:'#962f29'},{key:'events',label:'Sự kiện',color:'#c58e3d'},{key:'people',label:'Đăng ký lớp',color:'#ceb59b'}],'count','Xu hướng sinh hoạt, sự kiện và đăng ký lớp'),'Sáu tháng gần nhất');
    const pdFinanceChart=()=>pdPanel('Theo dõi thu – chi tài chính','account_balance_wallet',pdBarsChart(payments,[{key:'thu',label:'Tổng thu',color:'#962f29'},{key:'chi',label:'Tổng chi',color:'#33886e'}],'money','Thu chi đã xác nhận theo tháng'),'Chứng từ đã xác nhận');
    const pdEventChart=()=>pdPanel('Sự kiện & tiếp nhận theo tháng','calendar_month',pdMixedChart(time,{key:'events',label:'Sự kiện',color:'#962f29'},{key:'intakes',label:'Tiếp nhận',color:'#c58e3d'}),'Sáu tháng gần nhất');
    const taskTable=()=>pdTable('Công việc cần theo dõi',['Mã','Nội dung công việc','Người phụ trách','Hạn thực hiện','Trạng thái','Ưu tiên'],pdTaskRows(pdMainTasks()),'assignment','tasks');
    const eventList=()=>pdPreviewList('Sự kiện sắp diễn ra','event',eventsCards.slice(0,4).map(r=>({...pdDateBadge(r,'Ngày dương lịch'),title:r['Tên sự kiện']||r['Mã sự kiện'],detail:[r['Giờ bắt đầu']||'',r['Địa điểm']||''].filter(Boolean).join(' · ')||'Chưa có địa điểm',key:r['Mã sự kiện'],module:'events'})),'events');
    const taskList=()=>pdPreviewList('Nhắc việc ưu tiên','notifications_active',due.slice().sort((a,b)=>date(a['Ngày hạn'])-date(b['Ngày hạn'])).slice(0,4).map(r=>({...pdDateBadge(r,'Ngày hạn'),title:taskTitle(r),detail:empName(r),key:r['Mã công việc'],module:'tasks'})),'action-center');
    if(tab==='overview'){
      kpis=[['Phật tử / người tham gia',fmt(peopleActive),'Hồ sơ còn hoạt động','groups','red','people'],['Nhóm lớp',fmt(classes.length),'Tổng nhóm lớp','school','gold','classes'],['Buổi sinh hoạt',fmt(sessionsPeriod.length),'Trong kỳ đang xem','calendar_month','gold','sessions'],['Công việc quá hạn',fmt(due.length),'Chưa hoàn thành','assignment_late','red','tasks'],['Khoản phải thu',pdMoney(feesTotal),'Phải thu đã ghi nhận','payments','gold','fees'],['Sự kiện sắp tới',fmt(eventsCards.length),'Trong 30 ngày tới','event','red','events']];
      charts=[pdActivities(),pdTaskChart(),pdFinanceChart(),pdEventChart()];
      bottom=[pdAccess('tasks')?taskTable():'',pdAccess('events')?eventList():'',pdAccess('tasks')?taskList():''];
    }else if(tab==='study'){
      const members=pdAll('memberships'),att=pdAll('attendance'),exams=pdAll('exams'),results=pdAll('results');
      kpis=[['Nhóm lớp',fmt(classes.length),'Toàn bộ hồ sơ','school','gold','classes'],['Thành viên lớp',fmt(members.length),'Liên kết người – lớp','diversity_3','red','memberships'],['Buổi sinh hoạt',fmt(sessionsPeriod.length),'Trong kỳ','event','gold','sessions'],['Lượt có mặt',fmt(att.filter(r=>r['Trạng thái điểm danh']==='Có mặt').length),'Từ bản ghi điểm danh','how_to_reg','green','attendance'],['Kỳ thi',fmt(exams.length),'Toàn bộ','workspace_premium','gold','exams'],['Kết quả thi',fmt(results.length),'Đã ghi nhận','military_tech','red','results']];
      const byClass=new Map();members.forEach(r=>{const id=String(r['Mã nhóm lớp']||'');byClass.set(id,(byClass.get(id)||0)+1);});
      charts=[pdActivities(),pdPanel('Cơ cấu điểm danh','donut_large',pdDonut(pdStatus(att,'Trạng thái điểm danh').map((r,i)=>({...r,color:PD_COLORS[i%PD_COLORS.length]})),'lượt'),'Lũy kế'),pdPanel('Thành viên theo nhóm lớp','bar_chart',pdRank(classes.map(r=>({label:r['Tên nhóm lớp']||r['Mã nhóm lớp'],value:byClass.get(String(r['Mã nhóm lớp']))||0})).sort((a,b)=>b.value-a.value),'nhóm lớp'),'Top nhóm lớp'),pdPanel('Đăng ký lớp theo tháng','show_chart',pdBarsChart(time,[{key:'people',label:'Lượt đăng ký',color:'#962f29'}]),'6 tháng gần nhất')];
      bottom=[pdAccess('classes')?pdTable('Sĩ số theo nhóm lớp',['Nhóm lớp','Thành viên','Trạng thái'],classes.map(r=>[pdTextCell(r['Tên nhóm lớp']),`<strong>${fmt(byClass.get(String(r['Mã nhóm lớp']))||0)}</strong>`,pill(r['Trạng thái'])]),'school','classes'):'',pdAccess('sessions')?pdPreviewList('Buổi sinh hoạt sắp tới','event',sessions.filter(r=>date(r['Ngày sinh hoạt'])>=today()&&r['Trạng thái']!=='Đã hủy').sort((a,b)=>date(a['Ngày sinh hoạt'])-date(b['Ngày sinh hoạt'])).slice(0,4).map(r=>({...pdDateBadge(r,'Ngày sinh hoạt'),title:lookup('classes',r['Mã nhóm lớp']),detail:r['Nội dung']||r['Địa điểm']||'Buổi sinh hoạt',key:r['Mã buổi'],module:'sessions'})),'sessions'):'',pdAccess('exams')?pdPreviewList('Kỳ thi gần đây','military_tech',exams.slice(-4).reverse().map(r=>({...pdDateBadge(r,'Ngày thi'),title:r['Tên kỳ thi']||r['Mã kỳ thi'],detail:lookup('classes',r['Mã nhóm lớp']),key:r['Mã kỳ thi'],module:'exams'})),'exams'):''];
    }else if(tab==='fees'){
      const receipts=pdAll('feeReceipts').filter(r=>r['Trạng thái']==='Đã xác nhận'),ref=pdAll('feeRefunds').filter(r=>r['Trạng thái']==='Đã duyệt'),feePaid=receipts.reduce((s,r)=>s+num(r['Số tiền']),0),refunded=ref.reduce((s,r)=>s+num(r['Số tiền hoàn']),0),remaining=Math.max(0,feesTotal-feePaid+refunded);
      kpis=[['Phải thu học phí',pdMoney(feesTotal),'Theo hồ sơ','payments','gold','fees'],['Đã thu xác nhận',pdMoney(feePaid),'Tổng tiền học phí','account_balance_wallet','green','feeReceipts'],['Đã hoàn duyệt',pdMoney(refunded),'Theo chứng từ','currency_exchange','red','feeRefunds'],['Ước còn phải thu',pdMoney(remaining),'Cần đối chiếu từng khoản','request_quote','red','fees'],['Giao dịch thu',fmt(funds.filter(r=>r['Trạng thái']==='Đã xác nhận'&&r['Loại giao dịch']==='Thu').length),'Toàn bộ chứng từ','trending_up','green','finance'],['Quỹ',fmt(pdAll('funds').length),'Quỹ đang quản lý','wallet','gold','funds']];
      charts=[pdFinanceChart(),pdPanel('Trạng thái khoản học phí','donut_large',pdDonut(pdStatus(fees).map((r,i)=>({...r,color:PD_COLORS[i%PD_COLORS.length]})),'khoản'),'Toàn bộ khoản học phí'),pdPanel('Thu và hoàn học phí trong 6 tháng','account_balance',pdBarsChart(monthsFinance,[{key:'thu',label:'Đã thu',color:'#33886e'},{key:'hoan',label:'Đã hoàn',color:'#962f29'}],'money'),'Chứng từ xác nhận / duyệt'),pdPanel('Cơ cấu tiền thu – chi','show_chart',pdBarsChart(payments,[{key:'thu',label:'Thu',color:'#c58e3d'},{key:'chi',label:'Chi',color:'#962f29'}],'money'),'Trong 6 tháng')];
      bottom=[pdAccess('fees')?pdTable('Các khoản học phí cần theo dõi',['Người','Lớp','Kỳ','Phải thu','Trạng thái'],fees.filter(r=>!['Đã thu','Đã hủy'].includes(r['Trạng thái'])).slice(0,7).map(r=>[pdTextCell(lookup('people',r['Mã người'])),pdTextCell(lookup('classes',r['Mã nhóm lớp'])),pdTextCell(r['Kỳ học phí']),`<strong>${pdMoney(num(r['Phải thu']))}</strong>`,pill(r['Trạng thái'])]),'payments','fees'):'',pdAccess('orders')?pdPreviewList('Đơn bán còn nợ','receipt_long',pdAll('orders').filter(r=>num(r['Còn nợ'])>0).sort((a,b)=>num(b['Còn nợ'])-num(a['Còn nợ'])).slice(0,4).map(r=>({...pdDateBadge(r,'Ngày hẹn thanh toán'),title:r['Mã đơn bán']+' · '+(r['Tên người mua']||''),detail:'Còn nợ: '+pdMoney(num(r['Còn nợ'])),key:r['Mã đơn bán'],module:'orders'})),'orders'):'',pdAccess('finance')?pdPreviewList('Giao dịch gần đây','wallet',funds.slice(-4).reverse().map(r=>({...pdDateBadge(r,'Ngày giao dịch'),title:(r['Loại giao dịch']||'Giao dịch')+' · '+pdMoney(num(r['Số tiền'])),detail:r['Nhóm thu chi']||'Chứng từ tài chính',key:r['Mã giao dịch'],module:'finance'})),'finance'):''];
    }else if(tab==='stock'){
      const products=pdAll('products'),assets=pdAll('assets'),ledger=pdAll('stockLedger'),purchases=pdAll('purchases'),issues=pdAll('supplyIssues');
      kpis=[['SKU',fmt(products.length),'Sản phẩm trong hệ thống','inventory_2','gold','products'],['Tài sản',fmt(assets.length),'Hồ sơ đang quản lý','devices','red','assets'],['Kho',fmt(pdAll('stores').length),'Địa điểm quản lý','warehouse','gold','stores'],['Phiếu nhập',fmt(purchases.length),'Tổng chứng từ','move_to_inbox','green','purchases'],['Lượt xuất vật tư',fmt(issues.length),'Tổng phiếu','construction','red','supplyIssues'],['Dòng sổ kho',fmt(ledger.length),'Bút toán đã ghi','inventory','gold','stockLedger']];
      const sku=new Map();ledger.forEach(r=>{const id=r['Mã SKU'];if(!id)return;sku.set(id,(sku.get(id)||0)+num(r['Số lượng nhập'])+num(r['Số lượng xuất']));});
      const incoming=products.map(r=>({label:r['Tên sản phẩm']||r['Mã SKU'],value:sku.get(r['Mã SKU'])||0})).sort((a,b)=>b.value-a.value);
      charts=[pdPanel('Lượng nhập – xuất theo tháng','stacked_bar_chart',pdBarsChart(stockMonth,[{key:'nhap',label:'Số lượng nhập',color:'#33886e'},{key:'xuat',label:'Số lượng xuất',color:'#962f29'}]),'Sổ kho'),pdPanel('Trạng thái tài sản','donut_large',pdDonut(pdStatus(assets).map((r,i)=>({...r,color:PD_COLORS[i%PD_COLORS.length]})),'tài sản'),'Lũy kế'),pdPanel('SKU biến động nhiều','bar_chart',pdRank(incoming,'số lượng nhập – xuất'),'Top SKU'),pdPanel('Hoạt động chứng từ kho','monitoring',pdBarsChart(months().map(m=>({label:m.label,phieu:pdAll('purchases').filter(r=>monthKey(date(r['Ngày nhập']))===m.key).length,don:pdAll('orders').filter(r=>monthKey(date(r['Ngày đặt']))===m.key).length})),[{key:'phieu',label:'Phiếu nhập',color:'#962f29'},{key:'don',label:'Đơn bán',color:'#c58e3d'}]),'6 tháng gần nhất')];
      bottom=[pdAccess('assets')?pdTable('Tài sản cần bảo dưỡng',['Tên tài sản','Ngày hết bảo hành','Tình trạng'],assets.filter(r=>{const d=date(r['Ngày hết bảo hành']);return d&&d<new Date(+today()+45*86400000);}).slice(0,7).map(r=>[pdTextCell(r['Tên tài sản']),pdTextCell(displayDate(r['Ngày hết bảo hành'])),pill(r['Trạng thái'])]),'devices','assets'):'',pdAccess('purchases')?pdPreviewList('Phiếu nhập gần đây','move_to_inbox',purchases.slice(-4).reverse().map(r=>({...pdDateBadge(r,'Ngày nhập'),title:r['Mã phiếu nhập'],detail:r['Trạng thái']||'Chứng từ nhập',key:r['Mã phiếu nhập'],module:'purchases'})),'purchases'):'',pdAccess('orders')?pdPreviewList('Đơn bán gần đây','shopping_cart',pdAll('orders').slice(-4).reverse().map(r=>({...pdDateBadge(r,'Ngày đặt'),title:r['Mã đơn bán'],detail:r['Tên người mua']||r['Trạng thái'],key:r['Mã đơn bán'],module:'orders'})),'orders'):''];
    }else if(tab==='memorial'){
      const free=slots.filter(r=>r['Trạng thái']==='Còn trống'&&!r['Mã hồ sơ hiện tại']),blocked=slots.filter(r=>r['Trạng thái']==='Tạm khóa'),used=slots.filter(r=>r['Trạng thái']==='Đã sử dụng'||r['Mã hồ sơ hiện tại']),history=pdAll('memorialHistory');
      kpis=[['Hồ sơ Nhà Linh',fmt(mem.length),'Toàn bộ hồ sơ','temple_buddhist','red','memorials'],['Tổng vị trí',fmt(slots.length),'Đã khai báo','grid_view','gold','slots'],['Vị trí còn trống',fmt(free.length),'Có thể xem xét bố trí','check_circle','green','slots'],['Đang sử dụng',fmt(used.length),'Đã phân bổ','folder_shared','red','slots'],['Tạm khóa',fmt(blocked.length),'Chưa sử dụng','lock','gold','slots'],['Lượt đổi vị trí',fmt(history.length),'Nhật ký cập nhật','history','red','memorialHistory']];
      const grouped=new Map();slots.forEach(r=>{const khu=r['Khu']||'Chưa rõ',old=grouped.get(khu)||{label:khu,trong:0,dung:0};if(r['Mã hồ sơ hiện tại']||r['Trạng thái']==='Đã sử dụng')old.dung++;else if(r['Trạng thái']==='Còn trống')old.trong++;grouped.set(khu,old);});
      const statMonth=months().map(m=>({label:m.label,count:history.filter(r=>monthKey(date(r['Ngày thay đổi']))===m.key).length}));
      charts=[pdPanel('Hồ sơ tiếp nhận 6 tháng','bar_chart',pdBarsChart(memMonth.map(m=>({label:m.label,count:m.count})),[{key:'count',label:'Tiếp nhận',color:'#962f29'}]),'Theo ngày tiếp nhận'),pdPanel('Tình trạng sử dụng vị trí','donut_large',pdDonut([{label:'Đang sử dụng',value:used.length,color:'#962f29'},{label:'Còn trống',value:free.length,color:'#33886e'},{label:'Tạm khóa',value:blocked.length,color:'#c58e3d'},{label:'Khác',value:Math.max(0,slots.length-used.length-free.length-blocked.length),color:'#ae9b86'}],'vị trí'),'Toàn bộ Nhà Linh'),pdPanel('Theo khu Nhà Linh','bar_chart',pdBarsChart([...grouped.values()].slice(0,8),[{key:'trong',label:'Còn trống',color:'#33886e'},{key:'dung',label:'Đã sử dụng',color:'#962f29'}]),'Theo khu'),pdPanel('Thay đổi vị trí theo tháng','show_chart',pdBarsChart(statMonth,[{key:'count',label:'Lượt thay đổi',color:'#c58e3d'}]),'Sáu tháng')];
      bottom=[pdAccess('memorials')?pdTable('Hồ sơ Nhà Linh',['Hồ sơ','Người được thờ','Vị trí','Trạng thái'],mem.slice(-7).reverse().map(r=>[`<strong>${pdTextCell(r['Mã hồ sơ'])}</strong>`,pdTextCell(r['Họ tên người được thờ']),pdTextCell(r['Mã vị trí']),pill(r['Trạng thái'])]),'temple_buddhist','memorials'):'',pdAccess('memorialHistory')?pdPreviewList('Lịch sử điều chỉnh','history',history.slice(-4).reverse().map(r=>({...pdDateBadge(r,'Ngày thay đổi'),title:r['Mã hồ sơ']||r['Mã lịch sử'],detail:r['Nội dung']||'Cập nhật vị trí'})),'memorialHistory'):'',pdAccess('slots')?pdPreviewList('Vị trí chưa sử dụng','grid_view',free.slice(0,4).map(r=>({date1:r['Ô']||'—',date2:r['Dãy']||'Khu',title:r['Khu']||r['Mã vị trí'],detail:'Mã: '+r['Mã vị trí'],key:r['Mã vị trí'],module:'slots'})),'slots'):''];
    }else{
      kpis=[['Công việc',fmt(t.length),'Tổng công việc','task','red','tasks'],['Quá hạn',fmt(due.length),'Cần xử lý','schedule','red','tasks'],['Đang thực hiện',fmt(inWork),'Theo trạng thái','autorenew','gold','tasks'],['Sự kiện',fmt(events.length),'Đã ghi nhận','event','gold','events'],['Sự kiện sắp tới',fmt(eventsCards.length),'Trong 30 ngày','celebration','green','events'],['Tiếp nhận',fmt(intakes.length),'Yêu cầu đã ghi','support_agent','gold','intakes']];
      const owner=new Map();t.filter(r=>!['Hoàn thành','Đã hủy'].includes(r['Trạng thái'])).forEach(r=>{const who=empName(r);owner.set(who,(owner.get(who)||0)+1);});
      const issueMonths=months().map(m=>({label:m.label,assigned:t.filter(r=>monthKey(date(r['Ngày giao']))===m.key).length,received:intakes.filter(r=>monthKey(date(r['Ngày tiếp nhận']))===m.key).length}));
      charts=[pdEventChart(),pdTaskChart(),pdPanel('Công việc giao và tiếp nhận','monitoring',pdBarsChart(issueMonths,[{key:'assigned',label:'Công việc giao',color:'#962f29'},{key:'received',label:'Tiếp nhận',color:'#c58e3d'}]),'6 tháng gần nhất'),pdPanel('Phân bổ công việc chưa xong','groups',pdRank([...owner].map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value),'phân công'),'Theo người phụ trách')];
      bottom=[pdAccess('tasks')?taskTable():'',pdAccess('events')?eventList():'',pdAccess('tasks')?taskList():''];
    }
    return {kpis,charts,bottom};
  }
  const PD_TABS=[['overview','Tổng quan','bar_chart'],['study','Phật sự & lớp học','school'],['fees','Học phí & tài chính','payments'],['stock','Kho & tài sản','inventory_2'],['memorial','Nhà Linh','temple_buddhist'],['operation','Điều hành & sự kiện','event']];
  const pdAvailable=(id)=>id==='overview'||id==='study'&&(pdAccess('classes')||pdAccess('sessions'))||id==='fees'&&(pdAccess('fees')||pdAccess('finance'))||id==='stock'&&(pdAccess('products')||pdAccess('assets')||pdAccess('stockLedger'))||id==='memorial'&&(pdAccess('memorials')||pdAccess('slots'))||id==='operation'&&(pdAccess('tasks')||pdAccess('events'));
  function pdBody(tab){
    const report=pdBuildData(tab),validCharts=report.charts.filter(Boolean),validBottom=report.bottom.filter(Boolean);
    return `<div class="pd-content"><div class="pd-section"><div class="pd-section-title">Chỉ số điều hành <span>Số liệu theo phạm vi quyền và kỳ đang xem</span></div>${pdKpis(report.kpis)}</div><div class="pd-section"><div class="pd-section-title">Biểu đồ phân tích <span>Biểu diễn dữ liệu thật · sáu tháng gần nhất khi áp dụng</span></div><div class="pd-graphs"><div class="pd-graphs-main">${validCharts.slice(0,2).join('')}</div><div class="pd-graphs-secondary">${validCharts.slice(2,4).join('')}</div></div></div><div class="pd-section"><div class="pd-section-title">Bảng dữ liệu & theo dõi <span>Danh sách đối chiếu, có thể mở phân hệ hoặc hồ sơ liên quan</span></div><div class="pd-bottom-grid">${validBottom.join('')||pdEmpty('bảng dữ liệu')}</div></div></div>`;
  }
  function renderPremiumDashboard(){
    if(!canPage('dashboard'))return;
    if(!pdAvailable(premiumTab))premiumTab='overview';
    const visible=PD_TABS.filter(([id])=>pdAvailable(id));
    htmlEl('page-content',`<div class="page-shell pd-dashboard">${head('Tổng quan điều hành','Tổng hợp tình hình hoạt động, Phật sự, tài chính và quản lý chùa theo dữ liệu thực tế.')}
      <div class="pd-tabs" role="tablist" aria-label="Nhóm báo cáo Dashboard">${visible.map(([key,title,ico])=>`<button type="button" role="tab" aria-selected="${String(key===premiumTab)}" data-premium-tab="${key}" class="${premiumTab===key?'active':''}">${pdIcon(ico)}${html(title)}</button>`).join('')}</div><div class="pd-data-scope">${pdIcon('verified_user')} Số liệu chỉ từ dữ liệu đã tải theo quyền. KPI lũy kế và KPI theo kỳ được ghi rõ; chuyển tab không đọc lại Google Sheet.</div><div id="premium-dashboard-body">${pdBody(premiumTab)}</div></div>`);
    notifications();
  }
  document.addEventListener('click',function(e){
    const tab=e.target.closest('[data-premium-tab]');if(!tab)return;e.preventDefault();e.stopImmediatePropagation();
    if(APP.state.page!=='dashboard'||!pdAvailable(tab.dataset.premiumTab))return;
    premiumTab=tab.dataset.premiumTab;
    document.querySelectorAll('[data-premium-tab]').forEach(el=>{const active=el===tab;el.classList.toggle('active',active);el.setAttribute('aria-selected',String(active));});
    const node=document.getElementById('premium-dashboard-body');if(node){try{node.innerHTML=pdBody(premiumTab);}catch(error){console.error('[Premium dashboard tab]',error);node.innerHTML='<div class="pd-empty">Không thể hiển thị nhóm báo cáo này. Các chức năng khác vẫn hoạt động.</div>';}}
  },true);

  function ownerList(){const map=new Map();rows('tasks').forEach(r=>{const id=String(r['Mã nhân sự phụ trách']||'');if(id)map.set(id,empName(r));});return [...map].sort((a,b)=>a[1].localeCompare(b[1],'vi'));}
  function actionView(){
    const task=taskStat(),tabs=[['overdue','Quá hạn',task.over.length],['soon','7 ngày tới',task.soon.length],['waiting','Chờ xác nhận',task.waiting.length],['working','Đang xử lý',task.working.length],['all','Tất cả',task.all.length]];
    const all=task.all,byStatus=[{label:'Quá hạn',value:task.over.length,color:'#ba4849'},{label:'Đến hạn 7 ngày',value:task.soon.length,color:'#d1a354'},{label:'Công việc khác',value:Math.max(0,all.length-task.over.length-task.soon.length),color:'#958275'}];
    const byOwner=new Map();all.filter(activeTask).forEach(r=>{let name=empName(r);byOwner.set(name,(byOwner.get(name)||0)+1);});
    const topOwner=[...byOwner].sort((a,b)=>b[1]-a[1]).slice(0,5),max=Math.max(1,...topOwner.map(x=>x[1]));
    htmlEl('page-content',`<div class="page-shell temple-dashboard">${head('Việc cần xử lý','Ưu tiên các công việc quá hạn, sắp đến hạn và đang chờ xác nhận.',canPage('tasks')?`<button class="btn btn-primary" data-page="tasks">${icon('open_in_new')} Mở quản lý công việc</button>`:'')}
      <div class="ti-intro"><span class="material-symbols-rounded">verified</span><span>Danh sách phân loại theo <b>ngày hạn và trạng thái</b>; công việc đã hoàn thành/đã hủy không tính là quá hạn. Bộ lọc và tìm kiếm xử lý trên trình duyệt, không tải lại Google Sheet.</span></div>
      <div class="ti-kpis">${kpi('Quá hạn',fmt(task.over.length),'Cần ưu tiên ngay','error','red')}${kpi('Đến hạn trong 7 ngày',fmt(task.soon.length),'Kể cả đến hạn hôm nay','hourglass_top','gold')}${kpi('Chờ xác nhận',fmt(task.waiting.length),'Cần duyệt / phản hồi','pending_actions','violet')}${kpi('Đang xử lý',fmt(task.working.length),'Công việc đang thực hiện','autorenew','blue')}${kpi('Hoàn thành',fmt(task.done.length),'Toàn bộ dữ liệu đang có','task_alt','green')}</div>
      <div class="ti-panels"><section class="ti-panel">${section('Cảnh báo theo hạn','donut_large','Các nhóm không chồng lấn')}${donutChart(byStatus,fmt(all.length),'Công việc')}</section><section class="ti-panel">${section('Phân bổ công việc chưa hoàn thành','groups','Top 5 người phụ trách')}${topOwner.length?topOwner.map(([name,n])=>`<div class="ti-mini-meter" style="grid-template-columns:minmax(0,135px) 1fr 26px"><span title="${att(name)}" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${html(name)}</span><span class="track"><i style="width:${(n/max*100).toFixed(0)}%"></i></span><b>${n}</b></div>`).join(''):'<div class="ti-empty">Không có phân công đang xử lý.</div>'}</section></div>
      <section class="ti-panel">${section('Danh sách công việc chi tiết','view_list',`<span id="ti-matched-count"></span>`)}
        <div class="ti-action-filters"><div class="ti-tabs">${tabs.map(([v,label,count])=>`<button type="button" data-ti-tab="${v}" class="${S.taskFilter===v?'active':''}">${label}<b>${count}</b></button>`).join('')}</div><div class="ti-filter-tools"><input type="search" data-ti-search placeholder="Tìm mã, công việc, tên người..." value="${att(S.taskQuery)}" aria-label="Tìm kiếm công việc"><select data-ti-owner aria-label="Lọc người phụ trách"><option value="">Tất cả người phụ trách</option>${ownerList().map(([v,label])=>`<option value="${att(v)}" ${S.taskOwner===v?'selected':''}>${html(label)}</option>`).join('')}</select><select data-ti-size aria-label="Số dòng mỗi trang">${[12,20,50].map(x=>`<option value="${x}" ${S.taskSize===x?'selected':''}>${x} dòng</option>`).join('')}</select></div></div><div id="ti-action-results"></div>
      </section>
    </div>`);
    renderActionRows();notifications();
  }
  function filteredActionRows(){let all=rows('tasks').slice();switch(S.taskFilter){case 'overdue':all=all.filter(overdue);break;case 'soon':all=all.filter(upcoming);break;case 'waiting':all=all.filter(awaiting);break;case 'working':all=all.filter(inProgress);break;}
    if(S.taskOwner)all=all.filter(r=>String(r['Mã nhân sự phụ trách']||'')===S.taskOwner);
    if(S.taskQuery.trim()){let q=norm(S.taskQuery);all=all.filter(r=>norm([r['Mã công việc'],r['Tiêu đề'],r['Nội dung'],r['Nhóm việc'],r['Mức ưu tiên'],empName(r)].join(' ')).includes(q));}
    all.sort((a,b)=>{const d1=date(a['Ngày hạn']),d2=date(b['Ngày hạn']);return ((d1?+d1:Infinity)-(d2?+d2:Infinity))||String(a['Mã công việc']).localeCompare(String(b['Mã công việc']),'vi',{numeric:true});});return all;
  }
  function renderActionRows(){let box=document.getElementById('ti-action-results');if(!box)return;const all=filteredActionRows(),pages=Math.max(1,Math.ceil(all.length/S.taskSize));S.taskPage=Math.max(1,Math.min(S.taskPage,pages));const start=(S.taskPage-1)*S.taskSize,subset=all.slice(start,start+S.taskSize);box.innerHTML=taskRowsTable(subset)+`<div class="ti-pagination"><span>Hiển thị ${all.length?start+1:0}–${Math.min(start+S.taskSize,all.length)} / ${all.length} công việc</span><div><button data-ti-page="${S.taskPage-1}" ${S.taskPage===1?'disabled':''}>‹ Trước</button><span>Trang ${S.taskPage}/${pages}</span><button data-ti-page="${S.taskPage+1}" ${S.taskPage>=pages?'disabled':''}>Sau ›</button></div></div>`;const c=document.getElementById('ti-matched-count');if(c)c.textContent=fmt(all.length)+' công việc';}
  function reportAddon(){const shell=document.querySelector('#page-content .page-shell');if(!shell)return;
    const mm=months(),monthly=mm.map(x=>({label:x.label,key:x.key,'Thu':0,'Chi':0}));finance().forEach(r=>{const m=monthly.find(x=>x.key===monthKey(date(r['Ngày giao dịch'])));if(m)m[r['Loại giao dịch']]+=num(r['Số tiền']);});
    let debtors=rows('orders').filter(r=>num(r['Còn nợ'])>0).sort((a,b)=>num(b['Còn nợ'])-num(a['Còn nợ'])).slice(0,10);
    let groups=new Map();rows('memberships').forEach(r=>{let id=String(r['Mã nhóm lớp']||'');if(id)groups.set(id,(groups.get(id)||0)+1);});
    shell.classList.add('temple-dashboard');shell.insertAdjacentHTML('beforeend',`<section class="ti-panel ti-report-addon">${section('Biểu đồ thu – chi đã xác nhận','monitoring','Sáu tháng gần nhất')}<div class="ti-chart">${barChart(monthly,['Thu','Chi'],['#398666','#c66b53'])}</div><div class="ti-legend"><span><i style="background:#398666"></i>Thu</span><span><i style="background:#c66b53"></i>Chi</span></div></section>
      <div class="ti-panels ti-report-addon">${canRead('orders')?`<section class="ti-panel">${section('Đơn bán còn công nợ','request_quote',`Top 10 khoản nợ`)}<div class="ti-table-wrap"><table class="ti-table"><thead><tr><th>Mã đơn</th><th>Khách</th><th>Ngày hẹn</th><th>Còn nợ</th></tr></thead><tbody>${debtors.map(r=>`<tr><td><strong>${html(r['Mã đơn bán'])}</strong></td><td>${html(r['Tên người mua']||'-')}</td><td>${html(r['Ngày hẹn thanh toán']?displayDate(r['Ngày hẹn thanh toán']):'-')}</td><td><strong>${money(num(r['Còn nợ']))}</strong></td></tr>`).join('')||'<tr><td colspan="4">Không có công nợ.</td></tr>'}</tbody></table></div></section>`:''}
      ${canRead('classes')?`<section class="ti-panel">${section('Thành viên theo nhóm lớp','school','Top 8 nhóm lớp')}<div class="ti-table-wrap"><table class="ti-table"><thead><tr><th>Nhóm lớp</th><th>Số thành viên</th><th>Tình trạng</th></tr></thead><tbody>${rows('classes').slice().sort((a,b)=>(groups.get(String(b['Mã nhóm lớp']))||0)-(groups.get(String(a['Mã nhóm lớp']))||0)).slice(0,8).map(r=>`<tr><td><strong>${html(r['Tên nhóm lớp']||r['Mã nhóm lớp'])}</strong></td><td>${fmt(groups.get(String(r['Mã nhóm lớp']))||0)}</td><td>${pill(r['Trạng thái'])}</td></tr>`).join('')||'<tr><td colspan="3">Chưa có nhóm lớp.</td></tr>'}</tbody></table></div></section>`:''}</div>`);
  }
  // Override only the two dashboard renders. Existing startup, login, CRUD, upload and reports server flows remain untouched.
  const previousDashboard=window.renderDashboard;
  const previousAction=window.renderActionCenter;
  const previousReport=window.renderReports;
  window.renderDashboard=function(){try{return renderPremiumDashboard();}catch(err){console.error('[Premium dashboard] render failed:',err);return typeof previousDashboard==='function'?previousDashboard():undefined;}};
  window.renderActionCenter=function(){try{return actionView();}catch(err){console.error('[DashboardInsights] action-center fallback:',err);return typeof previousAction==='function'?previousAction():undefined;}};
  if(typeof previousReport==='function')window.renderReports=function(){previousReport();try{reportAddon();}catch(err){console.warn('[DashboardInsights] report detail:',err);}};
  document.addEventListener('click',function(e){const tab=e.target.closest('[data-ti-tab]');if(tab){S.taskFilter=tab.dataset.tiTab;S.taskPage=1;document.querySelectorAll('[data-ti-tab]').forEach(el=>el.classList.toggle('active',el===tab));renderActionRows();return;}const page=e.target.closest('[data-ti-page]');if(page&&!page.disabled){S.taskPage=Number(page.dataset.tiPage)||1;renderActionRows();return;}});
  document.addEventListener('input',function(e){const el=e.target;if(el.matches('[data-ti-search]')){S.taskQuery=el.value;S.taskPage=1;renderActionRows();}});
  document.addEventListener('change',function(e){const el=e.target;if(el.matches('[data-ti-owner]')){S.taskOwner=el.value;S.taskPage=1;renderActionRows();}if(el.matches('[data-ti-size]')){S.taskSize=Number(el.value)||12;S.taskPage=1;renderActionRows();}});
  window.__CHUA_INSIGHTS_READY=true;
})();
/* ===== V8.4.8 Section ===== */
/* ===== CHÙA V8.4.8 DATA MANAGEMENT UI =====
 * Independent progressive enhancement. No GAS calls in rendering/filtering/views.
 * All existing startup, Wizard and core CRUD remain untouched.
 */
(function(){
  'use strict';
  const SELECTABLE_VIEWS={
    employees:['table','card'],people:['table','card'],classes:['table','card'],
    sessions:['table','calendar'],exams:['table','card'],events:['table','card','calendar'],
    memorials:['table','card'],slots:['table','map'],guests:['table','card'],
    tasks:['table','kanban'],intakes:['table','card'],products:['table','card'],
    assets:['table','card'],vehicles:['table','card'],stores:['table','card'],vendors:['table','card']
  };
  const FILTER_CONFIG={
    employees:['Bộ phận','Chức danh','Trạng thái'],people:['Giới tính','Trạng thái','__class'],
    classes:['Loại nhóm lớp','Trạng thái','Mã nhân sự phụ trách'],
    memberships:['Mã nhóm lớp','Vai trò','Trạng thái'],sessions:['Mã nhóm lớp','Mã nhân sự phụ trách','Trạng thái'],
    attendance:['__sessionClass','Mã buổi','Trạng thái điểm danh','Mã người'],exams:['Mã nhóm lớp','Trạng thái','Mã nhân sự phụ trách'],
    results:['Mã kỳ thi','Kết quả','Cấp đai'],fees:['Kỳ học phí','Mã nhóm lớp','Trạng thái'],
    feeReceipts:['Mã quỹ','Trạng thái','Mã khoản học phí'],feeRefunds:['Trạng thái','Mã khoản học phí','Người duyệt'],
    slots:['Khu','Dãy','Trạng thái','Tầng'],memorials:['Mã vị trí','Trạng thái','Gia chủ'],
    memorialHistory:['Mã hồ sơ','Mã nhân sự thực hiện'],
    events:['Loại sự kiện','Trạng thái','Mã nhân sự phụ trách'],
    guests:['Nhóm khách','Đơn vị'],invitations:['Mã sự kiện','Trạng thái tham dự','Kênh gửi'],
    tasks:['Trạng thái','Mức ưu tiên','Mã nhân sự phụ trách','Nhóm việc'],
    intakes:['Loại yêu cầu','Trạng thái','Mã nhân sự xử lý'],
    stores:['Loại kho','Trạng thái','Mã người quản lý'],vendors:['Nhóm cung cấp','Trạng thái'],
    products:['Nhóm sản phẩm','Dòng sản phẩm','Size','Trạng thái'],
    purchases:['Mã kho','Mã nhà cung cấp','Trạng thái'],purchaseItems:['Mã phiếu nhập','Mã SKU'],
    orders:['Mã kho','Trạng thái','Nguồn đơn'],orderItems:['Mã đơn bán','Mã SKU','Size'],
    orderReceipts:['Mã quỹ','Trạng thái','Mã đơn bán'],returns:['Trạng thái','Mã đơn bán','Tình trạng hàng'],
    transfers:['Mã kho xuất','Mã kho nhận','Trạng thái'],transferItems:['Mã phiếu chuyển','Mã SKU'],
    stocktakes:['Mã kho','Trạng thái','Mã SKU'],stockLedger:['Mã kho','Loại giao dịch','Mã SKU'],
    supplies:['Mã kho','Loại vật tư','Trạng thái'],supplyIssues:['Mã kho','Mã vật tư','Trạng thái'],
    loans:['Trạng thái','Mã vật tư','Mã người mượn'],loanReturns:['Mã phiếu mượn','Mã nhân sự nhận'],
    assets:['Loại tài sản','Trạng thái','Mã nhân sự quản lý'],warranties:['Trạng thái','Mã tài sản'],
    maintenance:['Trạng thái','Mã tài sản','Đơn vị thực hiện'],vehicles:['Loại xe','Trạng thái','Mã tài xế phụ trách'],
    trips:['Mã xe','Mã tài xế','Trạng thái'],parking:['Loại xe','Trạng thái','Biển số'],
    funds:['Loại quỹ','Trạng thái'],finance:['Loại giao dịch','Mã quỹ','Nhóm thu chi','Phương thức'],
    files:['Phân hệ','Loại tài liệu','Trạng thái'],emails:['Trạng thái','Nhóm nhắc việc'],
    audit:['Phân hệ','Hành động','Kết quả'],
    users:['Vai trò','Trạng thái']
  };
  const BULK_UPDATE={
    tasks:['Trạng thái','Mức ưu tiên','Mã nhân sự phụ trách'],
    people:['Trạng thái'],classes:['Trạng thái'],employees:['Trạng thái'],
    memberships:['Trạng thái'],intakes:['Trạng thái']
  };
  const BULK_DELETE=new Set(['tasks','intakes','guests','memberships']);
  const MAX_UPDATE=12,MAX_DELETE=6;
  const selected=new Map();
  APP.state._v48View=APP.state._v48View||{};
  APP.state._v48Advanced=APP.state._v48Advanced||{};
  APP.state._v48ExportIds=APP.state._v48ExportIds||{};
  let saving=false;
  function pick(k){if(!selected.has(k))selected.set(k,new Set());return selected.get(k);}
  function cleanPick(k){let valid=new Set(dataOf(k).map(r=>String(r[cfgOf(k).id]))),set=pick(k);for(const id of set)if(!valid.has(id))set.delete(id);return set;}
  function dateField(k){const c=cfgOf(k);return (c.dates||[]).find(f=>/Ngày|Thời gian|Thời điểm/.test(f))||(c.dateTimes||[])[0]||'';}
  const V49_BLANK='__V49_BLANK__';
  function labelOf(k,f,v){
    if(v===V49_BLANK)return 'Chưa xác định (để trống)';
    if(!v)return '';
    let ref=f==='__class'||f==='__sessionClass'?'classes':cfgOf(k).refs?.[f];
    if(ref){const cfg=cfgOf(ref),obj=dataOf(ref).find(x=>String(x[cfg.id])===String(v));
      const field=REF_NAME[ref]||cfg.required?.[0]||cfg.id;
      const name=obj?String(obj[field]||'').trim():'';
      return name&&name!==String(v)?name+' · '+v:(String(v)+' (chưa có tên)');
    }
    return String(v);
  }
  function valuesFor(k,f){
    const rows=dataOf(k),available=new Set(),cfg=cfgOf(k);
    if(f==='__class'){
      const visiblePeople=new Set(rows.map(r=>String(r['Mã người'])));
      dataOf('memberships').forEach(r=>{if(visiblePeople.has(String(r['Mã người']))&&r['Mã nhóm lớp'])available.add(String(r['Mã nhóm lớp']));});
    }else if(f==='__sessionClass'){
      const ids=new Set(rows.map(r=>String(r['Mã buổi'])));
      dataOf('sessions').forEach(r=>{if(ids.has(String(r['Mã buổi']))&&r['Mã nhóm lớp'])available.add(String(r['Mã nhóm lớp']));});
    }else{
      rows.forEach(r=>available.add(String(r[f]??'').trim()||V49_BLANK));
    }
    // Restrict dependent choices to the selected group(s) while retaining scoped data.
    if(k==='attendance'&&f==='Mã buổi'){
      const chosen=APP.state.filters?.[k]?.__sessionClass;
      const set=new Set(Array.isArray(chosen)?chosen:(chosen?[chosen]:[]));
      if(set.size){const ids=new Set(dataOf('sessions').filter(s=>set.has(String(s['Mã nhóm lớp']))).map(s=>String(s['Mã buổi'])));
        for(const id of available)if(id!==V49_BLANK&&!ids.has(id))available.delete(id);
      }
    }
    // Remove blank option unless rows actually contain empty values.
    const vals=[...available];vals.sort((a,b)=>labelOf(k,f,a).localeCompare(labelOf(k,f,b),'vi',{numeric:true}));return vals;
  }
  function configFields(k){const cfg=cfgOf(k),actual=new Set(cfg.fields||[]);if(k==='people')actual.add('__class');if(k==='attendance')actual.add('__sessionClass');let preferred=(FILTER_CONFIG[k]||[]).filter(f=>actual.has(f));
    if(!preferred.length)preferred=[...Object.keys(cfg.cats||{}),...Object.keys(cfg.refs||{}),'Trạng thái','Loại giao dịch'].filter(f=>actual.has(f));
    return [...new Set(preferred)].slice(0,6);
  }
  function normalizedValue(s){return norm(s);}
  // Filtering is pure client-side; special "Ngày từ/đến" fields never reach the GAS layer.
  window.filteredRows=function(key){
    const cfg=cfgOf(key),filter=APP.state.filters[key]||{},q=norm(APP.state.search[key]||'');
    const link=APP.state.linkedContext?.childKey===key?APP.state.linkedContext:null;
    let rows=dataOf(key).filter(r=>{
      if(link&&String(r[link.foreignKey]??'')!==String(link.sourceId))return false;
      if(q&&!Object.values(r).some(v=>norm(v).includes(q)))return false;
      for(const [field,raw] of Object.entries(filter)){
        if(raw==null||raw===''||(Array.isArray(raw)&&raw.length===0))continue;
        if(['__from','__to','__deadline','__periodFrom','__periodTo','__amountFrom','__amountTo'].includes(field))continue;
        const values=Array.isArray(raw)?raw:[raw];
        if(field==='__class'){
          if(key!=='people'||!dataOf('memberships').some(m=>values.includes(String(m['Mã nhóm lớp']))&&String(m['Mã người'])===String(r['Mã người'])))return false;
          continue;
        }
        if(field==='__sessionClass'){
          if(key!=='attendance'||!dataOf('sessions').some(s=>String(s['Mã buổi'])===String(r['Mã buổi'])&&values.includes(String(s['Mã nhóm lớp']))))return false;
          continue;
        }
        const value=String(r[field]??'').trim()||V49_BLANK;
        if(!values.includes(value))return false;
      }
      const period=String(r['Kỳ học phí']||''),m=period.match(/^(\d{2})\/(\d{4})$/);
      const pv=m?Number(m[2])*12+Number(m[1]):null;
      const pnum=s=>{const a=String(s||'').match(/^(\d{4})-(\d{2})$/);return a?Number(a[1])*12+Number(a[2]):null;};
      if(filter.__periodFrom&&(pv===null||pv<pnum(filter.__periodFrom)))return false;
      if(filter.__periodTo&&(pv===null||pv>pnum(filter.__periodTo)))return false;
      const amountByModule={fees:'Phải thu',finance:'Số tiền',orders:'Còn nợ',purchases:'Tổng tiền',assets:'Giá mua'};
      const numericField=amountByModule[key];
      if(numericField&&(filter.__amountFrom!==undefined||filter.__amountTo!==undefined)){
        const moneyAmount=Number(r[numericField]||0);
        if(filter.__amountFrom!==undefined&&filter.__amountFrom!==''&&moneyAmount<Number(filter.__amountFrom))return false;
        if(filter.__amountTo!==undefined&&filter.__amountTo!==''&&moneyAmount>Number(filter.__amountTo))return false;
      }
      const df=dateField(key),day=df?parseDate(r[df]):null;
      if(filter.__from&&(!day||day<parseDate(filter.__from)))return false;
      if(filter.__to&&(!day||day>parseDate(filter.__to)))return false;
      if(filter.__deadline){const dl=parseDate(r['Ngày hạn']);if(!dl)return false;const now=today(),end=new Date(+now+7*86400000),closed=['Hoàn thành','Đã hủy'].includes(String(r['Trạng thái']||''));
        if(filter.__deadline==='overdue'&&!(dl<now&&!closed))return false;
        if(filter.__deadline==='soon'&&!(dl>=now&&dl<=end&&!closed))return false;
      }
      return true;
    });
    const sort=APP.state.sort[key]||'newest',fld=(cfg.dates||[]).find(f=>/Ngày/.test(f))||cfg.id;
    rows.sort((a,b)=>{
      if(sort==='name'){const af=String(a[cfg.required?.[0]||cfg.id]||''),bf=String(b[cfg.required?.[0]||cfg.id]||'');return af.localeCompare(bf,'vi',{numeric:true});}
      const av=(cfg.dates||[]).includes(fld)?(parseDate(a[fld])?.getTime()||0):String(a[fld]??'');
      const bv=(cfg.dates||[]).includes(fld)?(parseDate(b[fld])?.getTime()||0):String(b[fld]??'');
      const cmp=typeof av==='number'?av-bv:String(av).localeCompare(String(bv),'vi',{numeric:true});return cmp*(sort==='oldest'?1:-1);
    });return rows;
  };
  function selectMarkup(k,f){
    const applied=APP.state.filters[k]?.[f],arr=Array.isArray(applied)?applied:(applied?[applied]:[]);
    const displayField=f==='__class'||f==='__sessionClass'?'Nhóm lớp':f;
    const heading=!arr.length?'Tất cả '+displayField.toLowerCase():arr.length===1?labelOf(k,f,arr[0]):arr.length+' giá trị đã chọn';
    return `<div class="v48-filter-item v49-filter-item"><span>${esc(displayField)}</span><button type="button" class="v49-filter-trigger ${arr.length?'is-filtered':''}" data-v49-open="1" data-module="${att(k)}" data-field="${att(f)}" aria-haspopup="dialog" aria-expanded="false"><span class="v49-filter-display">${esc(heading)}</span>${icon('keyboard_arrow_down')}</button></div>`;
  }
  function dateFilters(k){const df=dateField(k);if(!df)return '';const f=APP.state.filters[k]||{};
    return `<div class="v48-date-wrap"><label class="v48-filter-item"><span>${esc(df)} từ</span><input type="date" data-v48-date="__from" data-module="${k}" value="${att(f.__from||'')}"></label><label class="v48-filter-item"><span>Đến ngày</span><input type="date" data-v48-date="__to" data-module="${k}" value="${att(f.__to||'')}"></label></div>`;
  }
  function rangeFilters(k){
    const f=APP.state.filters[k]||{};
    const amounts={fees:'Phải thu',finance:'Số tiền',orders:'Còn nợ',purchases:'Tổng tiền',assets:'Giá mua'};
    let out='';
    if(k==='fees')out+=`<div class="v49-range-group"><span>Kỳ học phí</span><div class="v49-range-grid"><label>Từ tháng<input type="month" data-v49-range="__periodFrom" data-module="${k}" value="${att(f.__periodFrom||'')}"></label><label>Đến tháng<input type="month" data-v49-range="__periodTo" data-module="${k}" value="${att(f.__periodTo||'')}"></label></div></div>`;
    if(amounts[k])out+=`<div class="v49-range-group"><span>${esc(amounts[k])} (VND)</span><div class="v49-range-grid"><label>Từ số tiền<input type="number" min="0" step="1" data-v49-range="__amountFrom" data-module="${k}" value="${att(f.__amountFrom||'')}"></label><label>Đến số tiền<input type="number" min="0" step="1" data-v49-range="__amountTo" data-module="${k}" value="${att(f.__amountTo||'')}"></label></div></div>`;
    return out;
  }
  function toolbarNew(k){const filters=configFields(k),advanced=APP.state._v48Advanced[k]===true,more=filters.slice(3),f=APP.state.filters[k]||{};
    const active=Object.entries(f).filter(([,v])=>Array.isArray(v)?v.length:String(v||'').trim()).map(([field,value])=>({field,value}));
    return `<div class="v48-toolbar panel"><div class="v48-toolbar-row"><label class="v48-search">${icon('search')}<input data-search="${att(k)}" value="${att(APP.state.search[k]||'')}" placeholder="Tìm mã, tên, điện thoại, thông tin..."></label><button class="btn v48-advanced-btn ${advanced?'active':''}" type="button" data-v48-advanced="${k}">${icon('tune')} Bộ lọc ${active.length?`<span class="v48-count">${active.length}</span>`:''}</button><button class="btn v48-reset" type="button" data-v48-reset="${k}">${icon('restart_alt')} Đặt lại</button><span class="v48-toolbar-spacer"></span><label class="v48-small-select"><span>Sắp xếp</span><select data-v48-sort="${k}"><option value="newest" ${(!APP.state.sort[k]||APP.state.sort[k]==='newest')?'selected':''}>Mới nhất</option><option value="oldest" ${APP.state.sort[k]==='oldest'?'selected':''}>Cũ nhất</option><option value="name" ${APP.state.sort[k]==='name'?'selected':''}>Tên A–Z</option></select></label><label class="v48-small-select"><span>Số dòng</span><select data-v48-size="${k}">${[12,20,50,100].map(n=>`<option value="${n}" ${Number(APP.state.pageSize[k]||12)===n?'selected':''}>${n} dòng</option>`).join('')}</select></label></div>
    <div class="v48-filter-grid">${filters.slice(0,3).map(field=>selectMarkup(k,field)).join('')}</div>
    ${advanced?`<div class="v48-advanced-pane">${more.map(field=>selectMarkup(k,field)).join('')}${k==='tasks'?`<label class="v48-filter-item"><span>Thời hạn xử lý</span><select data-v48-filter="1" data-module="tasks" data-field="__deadline"><option value="">Tất cả thời hạn</option><option value="overdue" ${f.__deadline==='overdue'?'selected':''}>Quá hạn</option><option value="soon" ${f.__deadline==='soon'?'selected':''}>Đến hạn trong 7 ngày</option></select></label>`:''}${dateFilters(k)}${rangeFilters(k)}</div>`:''}
    ${active.length?`<div class="v48-active-filters">${active.map(a=>{const many=Array.isArray(a.value),vals=many?a.value:[a.value],isMeta=a.field.startsWith('__');const displayName=({'__class':'Nhóm lớp','__sessionClass':'Nhóm lớp','__from':'Từ ngày','__to':'Đến ngày','__deadline':'Thời hạn','__amountFrom':'Số tiền từ','__amountTo':'Số tiền đến','__periodFrom':'Kỳ từ','__periodTo':'Kỳ đến'}[a.field]||a.field);const label=a.field==='__deadline'?({'overdue':'Quá hạn','soon':'Sắp đến hạn'}[a.value]||a.value):many?vals.length===1?labelOf(k,a.field,vals[0]):vals.length+' giá trị':isMeta?a.value:labelOf(k,a.field,a.value);return `<button type="button" class="v48-filter-chip" data-v48-clear="${att(k)}" data-field="${att(a.field)}"><span>${esc(displayName)}: ${esc(label)}</span>${icon('close')}</button>`;}).join('')}</div>`:''}</div>`;
  }
  function pageSlice(k,rows){const ps=APP.state.pageSize[k]||12,p=pageN(k,rows.length);return {ps,p,chunk:rows.slice((p-1)*ps,p*ps),pages:Math.max(1,Math.ceil(rows.length/ps))};}
  function tableNew(k,chunk,rows){const c=cfgOf(k),fields=tableFields(k),selection=cleanPick(k),all=chunk.length&&chunk.every(r=>selection.has(String(r[c.id])));
    if(!chunk.length)return empty('Không có dữ liệu phù hợp','Thử xóa bộ lọc hoặc thay đổi từ khóa tìm kiếm.');
    return `<div class="data-table-wrap"><table class="data-table module-table v48-data-table"><thead><tr><th class="v48-check-col"><input type="checkbox" class="v48-checkbox" data-v48-all="${k}" ${all?'checked':''} aria-label="Chọn tất cả trang hiện tại"></th><th class="v48-action-col">Thao tác</th>${fields.map(field=>`<th>${esc(field)}</th>`).join('')}</tr></thead><tbody>${chunk.map(r=>{const id=String(r[c.id]||'');return `<tr class="${selection.has(id)?'v48-selected-row':''}"><td class="v48-check-col"><input type="checkbox" class="v48-checkbox" data-v48-check="${att(k)}" value="${att(id)}" ${selection.has(id)?'checked':''} aria-label="Chọn ${att(id)}"></td><td class="v48-action-col"><div class="row-actions v48-row-actions">${moduleRowActions(k,r)}</div></td>${fields.map((field,i)=>`<td>${cellView(k,field,r[field],i===0)}</td>`).join('')}</tr>`;}).join('')}</tbody></table></div>`;
  }
  function cardNew(k,chunk){let c=cfgOf(k),set=cleanPick(k),idField=c.id,desc=(c.required||[]).filter(f=>f!==idField),all=(c.fields||[]).filter(f=>f!==idField&&!['Mật khẩu','Ảnh File ID'].includes(f));
    if(!chunk.length)return empty('Không có hồ sơ phù hợp','Điều chỉnh bộ lọc để xem dữ liệu.');
    return `<div class="v48-card-grid">${chunk.map(r=>{const id=String(r[idField]||''),primaryField=desc[0]||all[0]||idField,primary=String(r[primaryField]||id);const details=all.filter(f=>f!==primaryField).filter(f=>String(r[f]??'').trim()).slice(0,4);
      return `<article class="v48-entity-card ${set.has(id)?'selected':''}"><div class="v48-card-header"><label class="v48-card-check"><input type="checkbox" class="v48-checkbox" data-v48-check="${att(k)}" value="${att(id)}" ${set.has(id)?'checked':''}> Chọn</label><span class="v48-card-id">${esc(id)}</span></div><div class="v48-card-heading"><span class="v48-card-icon">${icon(c.icon||'inventory_2')}</span><div><h3>${esc(primary)}</h3><p>${esc(c.title||k)}</p></div></div><div class="v48-card-data">${details.map(f=>`<div><small>${esc(f)}</small><strong>${esc((c.refs||{})[f]?lookup(c.refs[f],r[f]):(c.dates||[]).includes(f)?displayDate(r[f]):(c.numbers||[]).includes(f)?money(r[f]):r[f])}</strong></div>`).join('')}</div><div class="v48-card-footer">${r['Trạng thái']?badge(r['Trạng thái']):'<span></span>'}<div class="row-actions v48-row-actions">${moduleRowActions(k,r)}</div></div></article>`;
    }).join('')}</div>`;
  }
  function kanbanNew(k,rows){const status=['Chưa bắt đầu','Đang thực hiện','Chờ xác nhận','Hoàn thành','Tạm dừng'];let set=cleanPick(k);
    return `<div class="v48-kanban">${status.map(st=>{const list=rows.filter(r=>r['Trạng thái']===st);return `<div class="v48-kanban-col"><div class="v48-kanban-head">${badge(st)} <b>${list.length}</b></div><div class="v48-kanban-body">${list.slice(0,120).map(r=>{let id=String(r['Mã công việc']||'');return `<div class="v48-kanban-task"><label><input type="checkbox" class="v48-checkbox" data-v48-check="${k}" value="${att(id)}" ${set.has(id)?'checked':''}></label><button type="button" data-action="view-row" data-module="tasks" data-id="${att(id)}"><strong>${esc(r['Tiêu đề']||id)}</strong><small>${esc(id)} · ${esc(lookup('employees',r['Mã nhân sự phụ trách']))}</small><small>Hạn: ${displayDate(r['Ngày hạn'])}</small></button></div>`;}).join('')||'<p class="v48-empty-mini">Không có công việc</p>'}</div></div>`;}).join('')}</div>`;
  }
  function calendarNew(k,rows){let dateName=k==='events'?'Ngày dương lịch':'Ngày sinh hoạt',dayRows=rows.filter(r=>parseDate(r[dateName])).slice().sort((a,b)=>parseDate(a[dateName])-parseDate(b[dateName]));const byDay=new Map();for(const r of dayRows){let d=parseDate(r[dateName]),str=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');if(!byDay.has(str))byDay.set(str,[]);byDay.get(str).push(r);}
    const now=new Date(),m=APP.state._v48Month?.[k]||`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`,[y,mon]=m.split('-').map(Number),start=new Date(y,mon-1,1),offset=(start.getDay()+6)%7,days=new Date(y,mon,0).getDate();
    return `<div class="v48-calendar"><div class="v48-calendar-controls"><button class="btn btn-sm" data-v48-month="${k}" data-direction="-1">${icon('chevron_left')} Trước</button><strong>Tháng ${String(mon).padStart(2,'0')}/${y}</strong><button class="btn btn-sm" data-v48-month="${k}" data-direction="1">Tiếp ${icon('chevron_right')}</button></div><div class="v48-calendar-grid">${['T2','T3','T4','T5','T6','T7','CN'].map(n=>`<span class="v48-day-name">${n}</span>`).join('')}${Array.from({length:offset},()=>'<div class="v48-calendar-day blank"></div>').join('')}${Array.from({length:days},(_,i)=>{const n=i+1,key=`${y}-${String(mon).padStart(2,'0')}-${String(n).padStart(2,'0')}`,arr=byDay.get(key)||[];return `<div class="v48-calendar-day"><strong>${n}</strong>${arr.slice(0,3).map(r=>`<button data-action="view-row" data-module="${k}" data-id="${att(r[cfgOf(k).id])}">${esc(r['Tên sự kiện']||r['Nội dung']||r[cfgOf(k).id])}</button>`).join('')}${arr.length>3?`<small>+${arr.length-3} mục</small>`:''}</div>`;}).join('')}</div><p class="v48-calendar-foot">Lịch dùng dữ liệu đã preload, không tải lại dữ liệu khi chuyển tháng. Bộ lọc bên trên vẫn được áp dụng.</p></div>`;
  }
  function slotsMap(k,rows){const set=cleanPick(k),grouped=new Map();rows.forEach(r=>{
    const zone=String(r['Khu']||'Chưa phân khu'),aisle=String(r['Dãy']||'Chưa có dãy'),name=zone+' • '+aisle;
    if(!grouped.has(name))grouped.set(name,[]);grouped.get(name).push(r);
  });
    if(!rows.length)return empty('Không có vị trí phù hợp','Thử bỏ điều kiện khu, dãy hoặc trạng thái.');
    return `<div class="v48-slot-sections">${[...grouped.entries()].map(([group,items])=>`<section class="v48-slot-section"><div class="v48-slot-heading"><strong>${esc(group)}</strong><span>${items.length} vị trí</span></div><div class="v48-slot-grid">${items.map(r=>{const id=String(r['Mã vị trí']),status=String(r['Trạng thái']||'Còn trống'),occupied=status==='Đã sử dụng'||Boolean(r['Mã hồ sơ hiện tại']),blocked=status==='Tạm khóa';return `<article class="v48-slot ${occupied?'occupied':blocked?'blocked':'free'}"><label><input type="checkbox" class="v48-checkbox" data-v48-check="slots" value="${att(id)}" ${set.has(id)?'checked':''}></label><button type="button" data-action="view-row" data-module="slots" data-id="${att(id)}"><b>${esc(r['Ô']||id)}</b><small>${esc(id)}</small><span>${esc(status)}</span></button><small>Tầng ${esc(r['Tầng']||'—')}</small></article>`;}).join('')}</div></section>`).join('')}</div>`;
  }
  function selectionBar(k,rows){const sel=cleanPick(k),count=sel.size,matching=rows.filter(r=>sel.has(String(r[cfgOf(k).id]))).length,hidden=count-matching;
    if(!count)return `<div class="v48-selection-hint">${icon('check_box_outline_blank')} Chọn dòng để xuất dữ liệu hoặc thao tác theo quyền.</div>`;
    return `<div class="v48-selection-bar"><strong>${count} bản ghi đã chọn</strong>${hidden?`<span class="v48-selection-warning">${hidden} ngoài kết quả lọc hiện tại</span>`:''}<button class="btn btn-sm" data-v48-action="select-page" data-module="${k}">${icon('playlist_add_check')} Chọn trang</button><button class="btn btn-sm" data-v48-action="clear-selection" data-module="${k}">Bỏ chọn</button>${k!=='users'?`<button class="btn btn-sm" data-v48-action="export-selected" data-module="${k}">${icon('download')} Xuất đã chọn</button>`:''}${canWrite(k)&&BULK_UPDATE[k]?`<button class="btn btn-sm v48-bulk-primary" data-v48-action="bulk-update" data-module="${k}">${icon('edit_note')} Cập nhật hàng loạt</button>`:''}${canDelete(k)&&BULK_DELETE.has(k)?`<button class="btn btn-sm btn-danger" data-v48-action="bulk-delete" data-module="${k}">${icon('delete_sweep')} Xóa đã chọn</button>`:''}</div>`;
  }
  const oldModule=window.renderModule;
  window.renderModule=function(k){try{
    sanitizeFilters(k);closeFilterPopup();
    if(!canRead(k))return setPage('dashboard');const cfg=cfgOf(k),rows=filteredRows(k),pagination=pageSlice(k,rows);const {ps,p,chunk,pages}=pagination,views=SELECTABLE_VIEWS[k]||['table'];let view=APP.state._v48View[k]||'table';if(!views.includes(view))view='table';
    let actions='';if(canWrite(k)&&!cfg.readOnly){actions+=`<button class="btn btn-primary" data-action="new-row" data-module="${k}">${icon('add_circle')} Thêm mới</button>`;
      if(k!=='users'&&!BLOCKED_TRANSACTION_KEYS.has(k))actions+=`<button class="btn" data-action="open-import" data-module="${k}">${icon('upload_file')} Import</button>`;}
    if(k!=='users')actions+=`<button class="btn" data-action="export-xlsx" data-module="${k}">${icon('download')} Export XLSX</button>`;
    if(k==='files'&&APP.permissions.canUpload)actions+=`<button class="btn btn-primary" data-action="upload-file">${icon('cloud_upload')} Tải tài liệu</button>`;
    if(k==='emails'&&APP.permissions.canSendEmails)actions+=`<button class="btn btn-primary" data-page="emailCenter">${icon('mail')} Quản lý Email nhắc việc</button>`;
    const hint=['files','emails','audit'].includes(k)&&APP.deferredStatus!=='done'?'Dữ liệu lịch sử được tải sau khi hiển thị, không chặn khởi động.':(cfg.readOnly?'Dữ liệu chỉ xem.':'Lưu và xóa dữ liệu được kiểm tra tại backend trước khi cập nhật giao diện.');
    const body=view==='card'?cardNew(k,chunk):view==='kanban'?kanbanNew(k,rows):view==='calendar'?calendarNew(k,rows):view==='map'?slotsMap(k,rows):tableNew(k,chunk,rows);
    const displayCount=(view==='table'||view==='card')?`Hiển thị ${rows.length?(p-1)*ps+1:0}-${Math.min(p*ps,rows.length)} / ${rows.length}`:`${rows.length} bản ghi phù hợp`;
    let pagelist=Array.from({length:Math.min(5,pages)},(_,i)=>Math.max(1,Math.min(p-2,Math.max(1,pages-4)))+i);
    htmlEl('page-content',`<div class="page-shell v48-shell">${head(cfg.title,PAGE_DESC[k]||'Quản lý dữ liệu',actions)}<div class="operation-banner">${icon('info')} Tab <b>${esc(cfg.sheet)}</b> (Database V8). ${esc(hint)}</div><div class="module-summary"><div class="panel"><small>Tổng bản ghi</small><strong>${dataOf(k).length}</strong></div><div class="panel"><small>Theo bộ lọc</small><strong>${rows.length}</strong></div><div class="panel"><small>Trang đang xem</small><strong>${view==='table'||view==='card'?p:'—'}</strong></div><div class="panel"><small>Số dòng / trang</small><strong>${ps}</strong></div></div>
      ${toolbarNew(k)}<div class="v48-view-heading"><span><strong>${esc(cfg.title)}</strong><small> · ${rows.length} kết quả</small></span><div class="v48-view-switch" aria-label="Chọn kiểu xem">${views.map(v=>`<button type="button" data-v48-view="${k}" data-view="${v}" class="${v===view?'active':''}" aria-pressed="${v===view}">${icon({table:'table_rows',card:'grid_view',calendar:'calendar_month',kanban:'view_kanban',map:'grid_on'}[v])} ${esc({table:'Bảng',card:'Card',calendar:'Lịch',kanban:'Kanban',map:'Sơ đồ ô'}[v])}</button>`).join('')}</div></div>
      ${selectionBar(k,rows)}<div class="panel table-panel v48-data-area">${body}${view==='table'||view==='card'?`<div class="table-footer"><span>${displayCount}</span><div class="pagination"><button data-nav="${k}" data-p="${p-1}" ${p<=1?'disabled':''}>‹</button>${pagelist.map(n=>`<button class="${n===p?'active':''}" data-nav="${k}" data-p="${n}">${n}</button>`).join('')}<button data-nav="${k}" data-p="${p+1}" ${p>=pages?'disabled':''}>›</button></div></div>`:''}</div></div>`);
  }catch(err){console.error('[V8.4.8] module view failed:',err);return oldModule(k);}};
  function setFilter(k,f,v){APP.state.filters[k]??={};if(Array.isArray(v)?v.length:Boolean(v))APP.state.filters[k][f]=v;else delete APP.state.filters[k][f];if(k==='attendance'&&f==='__sessionClass')delete APP.state.filters[k]['Mã buổi'];APP.state.pageNo[k]=1;renderModule(k);}
  function selectedPage(k){const {chunk}=pageSlice(k,filteredRows(k)),set=pick(k),id=cfgOf(k).id;chunk.forEach(r=>set.add(String(r[id])));renderModule(k);}
  function dropdownFieldOptions(k,f){return valuesFor(k,f).map(x=>({value:x,label:labelOf(k,f,x)}));}
  function bulkDialog(k){const fields=BULK_UPDATE[k]||[];const count=cleanPick(k).size;if(!canWrite(k)||!fields.length)return;
    const field=fields[0],opts=dropdownFieldOptions(k,field);
    const values=`${opts.map(o=>`<option value="${att(o.value)}">${esc(o.label)}</option>`).join('')}`;
    modal('Cập nhật nhiều '+cfgOf(k).title,`Đã chọn ${count} bản ghi. Giới hạn ${MAX_UPDATE} bản ghi/lượt, kiểm tra từng bản ghi trên máy chủ.`,
     `<div class="v48-bulk-dialog"><div class="form-field"><label>Trường cập nhật</label><select id="v48-bulk-field" data-v48-bulk-field="${k}">${fields.map(f=>`<option value="${att(f)}">${esc(f)}</option>`).join('')}</select></div><div class="form-field"><label>Giá trị mới</label><select id="v48-bulk-value">${values}</select></div><div class="operation-banner">${icon('warning')} Dữ liệu kho, quỹ và chứng từ đã xác nhận không được sửa/xóa hàng loạt. Các bản ghi không hợp lệ sẽ được báo riêng.</div></div>`,
     `<button class="btn" data-action="close-modal">Hủy</button><button class="btn btn-primary" data-v48-action="confirm-update" data-module="${k}">${icon('check')} Xác nhận cập nhật</button>`,'small');
  }
  async function bulkExecute(k,kind,field,value){if(saving)return;saving=true;const set=cleanPick(k),ids=[...set],limit=kind==='delete'?MAX_DELETE:MAX_UPDATE;
    if(!ids.length||ids.length>limit){saving=false;return toast('Vượt giới hạn',`Tối đa ${limit} bản ghi mỗi lượt. Hãy chọn lại.`, 'warning',6500);}
    const desc=kind==='delete'?`Xóa ${ids.length} hồ sơ đã chọn? Hệ thống sẽ kiểm tra liên kết trước khi xóa từng bản ghi.`:`Cập nhật ${field} thành "${labelOf(k,field,value)}" cho ${ids.length} bản ghi?`;
    saving=false;
    confirmBox('Xác nhận thao tác hàng loạt',desc,async()=>{
      if(saving)return;saving=true;closeModal();let ok=0,failed=[],noti=toast('Đang xử lý',`0/${ids.length} bản ghi đã kiểm tra.`, 'processing',0);
      try{
        for(let i=0;i<ids.length;i++){
          const id=ids[i],cfg=cfgOf(k),current=dataOf(k).find(r=>String(r[cfg.id])===id);
          if(!current){failed.push(id+': Bản ghi không còn trong dữ liệu hiện tại.');continue;}
          try{
            let result;
            if(kind==='delete'){
              if(!canDelete(k)||!BULK_DELETE.has(k))throw Error('Không có quyền xóa hàng loạt.');
              result=await gas('deleteRecord',k,id,{timeout:60000});
              APP.data.modules[k]=dataOf(k).filter(r=>String(r[cfg.id])!==id);
            }else{
              if(!canWrite(k)||!(BULK_UPDATE[k]||[]).includes(field))throw Error('Trường cập nhật không hợp lệ.');
              result=await gas('saveRecord',k,{[cfg.id]:id,[field]:value},{timeout:60000});
              mergeRow(k,result.entry);
            }
            applyServerPatches(result.patches);set.delete(id);ok++;
          }catch(err){failed.push(id+': '+String(err.message||err));if(/AUTH_REQUIRED/.test(String(err.message||'')))break;}
          toastUpdate(noti,'Đang xử lý',`${i+1}/${ids.length} bản ghi. Đã thành công ${ok}.`,'processing',0);
        }
      }finally{saving=false;if(APP.state.page===k)renderModule(k);toastUpdate(noti,failed.length?'Hoàn tất một phần':'Đã hoàn tất',`${ok}/${ids.length} thành công${failed.length?`; ${failed.length} thất bại`:''}.`,failed.length?'warning':'success',7000);
        if(failed.length)modal('Kết quả xử lý hàng loạt',`${ok} thành công, ${failed.length} không thành công. Các bản ghi lỗi vẫn được chọn để kiểm tra lại.`,`<div class="v48-error-list">${failed.map(x=>`<p>${esc(x)}</p>`).join('')}</div>`,`<button class="btn btn-primary" data-action="close-modal">Đóng</button>`,'wide');
      }
    });
  }
  /* V8.4.9: isolated, fixed-position multi-value filter. No google.script.run calls. */
  let popup=null;
  function popRoot(){return document.getElementById('v49-filter-root');}
  function closeFilterPopup(){if(popup?.anchor?.isConnected)popup.anchor.setAttribute('aria-expanded','false');popup=null;const root=popRoot();if(root)root.innerHTML='';}
  function sanitizeFilters(k){
    // sourceConstraint lives separately in APP.state.linkedContext; it is never sanitized by dropdown options.
    const map=APP.state.filters[k]||{};
    for(const [f,value] of Object.entries(map)){
      if(!Array.isArray(value))continue;
      const allowed=new Set(valuesFor(k,f));const next=value.filter(x=>allowed.has(x));
      if(next.length===0)delete map[f];else if(next.length!==value.length)map[f]=next;
    }
  }
  function visibleMatches(){if(!popup)return[];return popup.items.filter(v=>norm(labelOf(popup.key,popup.field,v)+' '+v).includes(norm(popup.search)));}
  function renderPopupList(){
    if(!popup)return;const root=popRoot(),list=root?.querySelector('[data-v49-results]');if(!list)return;
    const filtered=visibleMatches(),shown=filtered.slice(0,90),all=popup.draft.size===0;
    list.innerHTML=shown.map(value=>`<label class="v49-option"><input type="checkbox" data-v49-choice="${att(value)}" ${!all&&popup.draft.has(value)?'checked':''}><span>${esc(labelOf(popup.key,popup.field,value))}</span></label>`).join('')||'<div class="v49-no-items">Không tìm thấy giá trị phù hợp.</div>';
    const foot=root.querySelector('[data-v49-result-count]');if(foot)foot.textContent=`Hiển thị ${shown.length}/${filtered.length} lựa chọn`;
    const allInput=root.querySelector('[data-v49-all]');if(allInput)allInput.checked=all;
    const n=root.querySelector('[data-v49-selected]');if(n)n.textContent=all?'Tất cả':popup.draft.size+' đã chọn';
    const searched=root.querySelector('[data-v49-select-matches]');if(searched)searched.disabled=!filtered.length;
  }
  function openFilterPopup(k,f,anchor){
    closeFilterPopup();sanitizeFilters(k);const applied=APP.state.filters[k]?.[f],initial=Array.isArray(applied)?applied:(applied?[applied]:[]);
    popup={key:k,field:f,anchor:anchor,items:valuesFor(k,f),draft:new Set(initial),search:''};
    const fieldTitle=f==='__class'||f==='__sessionClass'?'Nhóm lớp':f,root=popRoot();if(!root)return;
    root.innerHTML=`<section class="v49-popover" role="dialog" aria-label="Bộ lọc ${att(fieldTitle)}">
      <div class="v49-popover-head"><strong>${esc(fieldTitle)}</strong><button class="v49-x" type="button" data-v49-close aria-label="Đóng">×</button></div>
      <label class="v49-search"><span class="material-symbols-rounded">search</span><input type="search" data-v49-search placeholder="Tìm tên hoặc mã (không dấu)..." autocomplete="off"></label>
      <div class="v49-top-actions"><label><input type="checkbox" data-v49-all> Tất cả ${esc(fieldTitle.toLowerCase())}</label><span data-v49-selected>Tất cả</span></div>
      <div class="v49-option-list" data-v49-results></div><div class="v49-result-foot"><small data-v49-result-count></small><button type="button" data-v49-select-matches>Chọn kết quả đang tìm</button></div>
      <div class="v49-popup-actions"><button type="button" class="btn" data-v49-reset>Đặt lại</button><span class="v49-spacer"></span><button type="button" class="btn" data-v49-cancel>Hủy</button><button type="button" class="btn btn-primary" data-v49-apply>Áp dụng</button></div>
    </section>`;
    const r=anchor.getBoundingClientRect(),el=root.firstElementChild,w=Math.min(430,window.innerWidth-24),h=el.offsetHeight;
    el.style.width=w+'px';el.style.left=Math.max(12,Math.min(r.left,window.innerWidth-w-12))+'px';
    el.style.top=(r.bottom+8+h<window.innerHeight? r.bottom+6 : Math.max(12,r.top-h-6))+'px';
    anchor.setAttribute('aria-expanded','true');renderPopupList();root.querySelector('[data-v49-search]')?.focus();
  }
  document.addEventListener('click',function(e){
    const trigger=e.target.closest('[data-v49-open]');if(trigger){e.preventDefault();e.stopImmediatePropagation();
      if(popup&&popup.anchor===trigger){closeFilterPopup();return;}
      openFilterPopup(trigger.dataset.module,trigger.dataset.field,trigger);return;
    }
    const button=e.target.closest('[data-v49-select-matches],[data-v49-reset],[data-v49-apply],[data-v49-cancel],[data-v49-close]');
    if(button&&popup){e.preventDefault();e.stopImmediatePropagation();
      if(button.hasAttribute('data-v49-select-matches')){const matches=visibleMatches();popup.draft=new Set([...popup.draft,...matches]);if(popup.draft.size===popup.items.length)popup.draft.clear();}
      if(button.hasAttribute('data-v49-reset')){popup.draft.clear();popup.search='';const search=popRoot()?.querySelector('[data-v49-search]');if(search)search.value='';}
      if(button.hasAttribute('data-v49-apply')){const k=popup.key,f=popup.field,vals=[...popup.draft];closeFilterPopup();setFilter(k,f,vals);return;}
      if(button.hasAttribute('data-v49-cancel')||button.hasAttribute('data-v49-close')){closeFilterPopup();return;}
      renderPopupList();return;
    }
    if(popup&&!e.target.closest('#v49-filter-root'))closeFilterPopup();
  },true);
  document.addEventListener('change',function(e){
    if(!popup)return;const cb=e.target.closest('[data-v49-choice],[data-v49-all]');if(!cb)return;
    e.stopImmediatePropagation();
    if(cb.hasAttribute('data-v49-all'))popup.draft.clear();
    else{const val=cb.dataset.v49Choice;if(cb.checked)popup.draft.add(val);else popup.draft.delete(val);
      if(popup.draft.size===popup.items.length)popup.draft.clear();}
    renderPopupList();
  },true);
  document.addEventListener('input',function(e){if(!popup||!e.target.matches('[data-v49-search]'))return;
    e.stopImmediatePropagation();popup.search=e.target.value;renderPopupList();
  },true);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&popup){e.preventDefault();e.stopImmediatePropagation();closeFilterPopup();}},true);
  document.addEventListener('change',function(e){const t=e.target;if(!t.matches('[data-v49-range]'))return;
    e.stopImmediatePropagation();setFilter(t.dataset.module,t.dataset.v49Range,t.value);
  },true);
  window.addEventListener('resize',closeFilterPopup);
  // Capture only our new controls; existing click dispatcher stays untouched.
  document.addEventListener('click',function(e){
    const target=e.target.closest('[data-v48-action],[data-v48-view],[data-v48-advanced],[data-v48-reset],[data-v48-clear],[data-v48-month]');if(!target)return;
    e.preventDefault();e.stopImmediatePropagation();
    let k=target.dataset.module||target.dataset.v48View||target.dataset.v48Advanced||target.dataset.v48Reset||target.dataset.v48Clear||target.dataset.v48Month;
    if(target.dataset.v48View){APP.state._v48View[k]=target.dataset.view;APP.state.pageNo[k]=1;renderModule(k);return;}
    if(target.dataset.v48Advanced){APP.state._v48Advanced[k]=!APP.state._v48Advanced[k];renderModule(k);return;}
    if(target.dataset.v48Reset){APP.state.filters[k]={};APP.state.search[k]='';APP.state.pageNo[k]=1;renderModule(k);return;}
    if(target.dataset.v48Clear){setFilter(k,target.dataset.field,'');return;}
    if(target.dataset.v48Month){let start=APP.state._v48Month?.[k]||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}`,vals=start.split('-').map(Number),d=new Date(vals[0],vals[1]-1+Number(target.dataset.direction||0),1);APP.state._v48Month??={};APP.state._v48Month[k]=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;renderModule(k);return;}
    switch(target.dataset.v48Action){
      case 'select-page':selectedPage(k);break;
      case 'clear-selection':pick(k).clear();renderModule(k);break;
      case 'export-selected':(async()=>{if(!pick(k).size)return;APP.state._v48ExportIds[k]=[...pick(k)];try{await exportXlsx(k,false);}finally{delete APP.state._v48ExportIds[k];}})();break;
      case 'bulk-update':if(pick(k).size>MAX_UPDATE)toast('Quá nhiều bản ghi',`Tối đa ${MAX_UPDATE} bản ghi/lượt`, 'warning');else bulkDialog(k);break;
      case 'confirm-update':{const f=document.getElementById('v48-bulk-field'),v=document.getElementById('v48-bulk-value');if(!f||!v||!v.value)return toast('Chưa chọn giá trị','Vui lòng chọn trường và giá trị mới.','warning');bulkExecute(k,'update',f.value,v.value);break;}
      case 'bulk-delete':if(pick(k).size>MAX_DELETE)toast('Quá nhiều bản ghi',`Tối đa ${MAX_DELETE} bản ghi/lượt`, 'warning');else bulkExecute(k,'delete');break;
    }
  },true);
  document.addEventListener('change',function(e){const t=e.target;
    if(t.matches('[data-v48-check]')){e.stopImmediatePropagation();let k=t.dataset.v48Check,s=pick(k);if(t.checked)s.add(t.value);else s.delete(t.value);renderModule(k);return;}
    if(t.matches('[data-v48-all]')){e.stopImmediatePropagation();const k=t.dataset.v48All,s=pick(k),c=cfgOf(k),{chunk}=pageSlice(k,filteredRows(k));chunk.forEach(r=>{const id=String(r[c.id]);if(t.checked)s.add(id);else s.delete(id);});renderModule(k);return;}
    if(t.matches('[data-v48-filter]')){e.stopImmediatePropagation();setFilter(t.dataset.module,t.dataset.field,t.value);return;}
    if(t.matches('[data-v48-date]')){e.stopImmediatePropagation();setFilter(t.dataset.module,t.dataset.v48Date,t.value);return;}
    if(t.matches('[data-v48-sort]')){e.stopImmediatePropagation();APP.state.sort[t.dataset.v48Sort]=t.value;APP.state.pageNo[t.dataset.v48Sort]=1;renderModule(t.dataset.v48Sort);return;}
    if(t.matches('[data-v48-size]')){e.stopImmediatePropagation();APP.state.pageSize[t.dataset.v48Size]=Number(t.value)||12;APP.state.pageNo[t.dataset.v48Size]=1;renderModule(t.dataset.v48Size);return;}
    if(t.matches('[data-v48-bulk-field]')){e.stopImmediatePropagation();const k=t.dataset.v48BulkField,sel=document.getElementById('v48-bulk-value');if(sel)sel.innerHTML=dropdownFieldOptions(k,t.value).map(o=>`<option value="${att(o.value)}">${esc(o.label)}</option>`).join('');}
  },true);
  window.__CHUA_DATA_UI_READY=true;
})();
/* ===== V8.5 WORKFLOW LAYER — tự tách khỏi startup, không gọi API trong render ===== */
(function(){
'use strict';
const LINKS={
 employees:[['classes','Mã nhân sự phụ trách','Lớp phụ trách'],['tasks','Mã nhân sự phụ trách','Công việc phụ trách'],['assets','Mã nhân sự quản lý','Tài sản quản lý'],['vehicles','Mã tài xế phụ trách','Xe được giao']],
 guests:[['invitations','Mã khách','Thư mời']],
 people:[['memberships','Mã người','Đăng ký lớp'],['fees','Mã người','Khoản học phí'],['attendance','Mã người','Điểm danh'],['results','Mã người','Kết quả thi']],
 classes:[['memberships','Mã nhóm lớp','Thành viên'],['sessions','Mã nhóm lớp','Buổi sinh hoạt'],['exams','Mã nhóm lớp','Kỳ thi'],['fees','Mã nhóm lớp','Học phí']],
 sessions:[['attendance','Mã buổi','Điểm danh']],exams:[['results','Mã kỳ thi','Kết quả thi']],
 fees:[['feeReceipts','Mã khoản học phí','Thu học phí'],['feeRefunds','Mã khoản học phí','Hoàn học phí']],
 purchases:[['purchaseItems','Mã phiếu nhập','Chi tiết nhập']],orders:[['orderItems','Mã đơn bán','Chi tiết bán'],['orderReceipts','Mã đơn bán','Thu tiền bán'],['returns','Mã đơn bán','Đổi trả']],
 transfers:[['transferItems','Mã phiếu chuyển','Chi tiết chuyển']],
 slots:[['memorials','Mã vị trí','Hồ sơ Nhà Linh']],memorials:[['memorialHistory','Mã hồ sơ','Lịch sử vị trí']],
 events:[['invitations','Mã sự kiện','Thư mời'],['tasks','Mã sự kiện','Công việc']],
 tasks:[['intakes','Mã công việc','Tiếp nhận'],['tasks','Mã việc cha','Công việc con']],
 supplies:[['supplyIssues','Mã vật tư','Xuất dùng'],['loans','Mã vật tư','Mượn dụng cụ']],
 loans:[['loanReturns','Mã phiếu mượn','Lần trả dụng cụ']],
 assets:[['warranties','Mã tài sản','Bảo hành'],['maintenance','Mã tài sản','Bảo dưỡng']],
 vehicles:[['trips','Mã xe','Chuyến đi']],vendors:[['purchases','Mã nhà cung cấp','Phiếu nhập']],
 stores:[['purchases','Mã kho','Phiếu nhập'],['orders','Mã kho','Đơn bán'],['stockLedger','Mã kho','Sổ kho']],
 funds:[['finance','Mã quỹ','Giao dịch quỹ']]
};
const DOCUMENTS={purchases:{child:'purchaseItems',fk:'Mã phiếu nhập',label:'Phiếu nhập',price:'Đơn giá nhập'},orders:{child:'orderItems',fk:'Mã đơn bán',label:'Đơn bán',price:'Đơn giá bán'},transfers:{child:'transferItems',fk:'Mã phiếu chuyển',label:'Chuyển kho',price:null}};
const DATE_DEFAULTS={'Ngày tham gia':true,'Ngày tiếp nhận':true,'Ngày sinh hoạt':true,'Ngày giao':true,'Ngày dương lịch':true,'Ngày đặt':true,'Ngày nhập':true,'Ngày chuyển':true,'Ngày thu':true,'Ngày đề nghị':true,'Ngày mượn':true,'Ngày trả':true,'Ngày gửi':true,'Ngày xuất':true,'Ngày kiểm kê':true,'Ngày thực hiện':true,'Ngày thi':true};
const stamp=()=>{const d=new Date();return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;};
const timestamp=()=>{const d=new Date();return `${stamp()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;};
const find=(k,id)=>dataOf(k).find(r=>String(r[cfgOf(k).id]||'')===String(id||''));
const realId=(k,r)=>r&&r[cfgOf(k).id];
function related(k,r){const id=realId(k,r);return (LINKS[k]||[]).filter(([child])=>canRead(child)).map(([child,fk,label])=>({child,fk,label,rows:dataOf(child).filter(x=>String(x[fk]||'')===String(id||''))}));}
function actionBtn(label,action,key,id,child='',fk=''){return `<button type="button" class="btn btn-sm ${action==='create'?'btn-primary':''}" data-v85-context="${action}" data-v85-key="${att(key)}" data-v85-id="${att(id)}" data-v85-child="${att(child)}" data-v85-fk="${att(fk)}">${icon(action==='create'?'add_circle':action==='quick'?'bolt':'open_in_new')} ${esc(label)}</button>`;}
function relatedHtml(k,r){
 const id=realId(k,r),links=related(k,r),parents=Object.entries(cfgOf(k).refs||{}).filter(([f,ref])=>r[f]&&canRead(ref)).map(([f,ref])=>({field:f,ref,id:String(r[f]),row:find(ref,r[f])}));if(!links.length&&!parents.length&&!['parking','tasks'].includes(k))return '';
 let html=`<section class="v85-related"><div class="v85-section-head"><div>${icon('account_tree')}<strong>Liên kết hồ sơ & thao tác nhanh</strong></div><small>Các hồ sơ bên dưới được lấy từ dữ liệu đã tải · không gọi Sheet khi xem</small></div>`;
 if(parents.length){html+=`<div class="v85-form-heading">${icon('link')} <strong>Hồ sơ gốc đang liên kết</strong></div><div class="v85-mini-records">${parents.map(p=>`<button type="button" data-v85-context="view" data-v85-child="${att(p.ref)}" data-v85-id="${att(p.id)}">${icon('account_tree')} <strong>${esc(p.field)}: ${esc(p.row?lookup(p.ref,p.id):p.id)}</strong><small>${esc(p.id)}</small>${icon('chevron_right')}</button>`).join('')}</div>`;}
 if(k==='parking'&&r['Trạng thái']==='Đang gửi'&&canWrite('parking'))html+=actionBtn('Trả xe','quick',k,id);
 if(k==='tasks'&&canWrite('tasks')&&!['Hoàn thành','Đã hủy'].includes(r['Trạng thái']))html+=actionBtn('Hoàn thành','quick',k,id);
 for(const link of links){html+=`<div class="v85-related-block"><div><strong>${esc(link.label)}</strong><span class="v85-related-count">${link.rows.length}</span></div><div class="v85-related-tools">`;
 if(canWrite(link.child)&&!cfgOf(link.child).readOnly)html+=actionBtn('Thêm '+link.label.toLowerCase(),'create',k,id,link.child,link.fk);
 html+=actionBtn('Xem danh sách','list',k,id,link.child,link.fk)+`</div></div>`;
 if(link.rows.length){html+=`<div class="v85-mini-records">`+link.rows.slice(0,5).map(x=>{const rid=realId(link.child,x),cfg=cfgOf(link.child),name=(cfg.required||[]).map(f=>x[f]).find(Boolean)||rid;return `<button type="button" data-v85-context="view" data-v85-child="${att(link.child)}" data-v85-id="${att(rid)}">${icon('description')} <strong>${esc(String(name).slice(0,65))}</strong><small>${esc(rid)}</small>${icon('chevron_right')}</button>`;}).join('')+`</div>`;}
 }
 if(k==='classes'&&canWrite('fees'))html+=`<div class="v85-quick-bar">${actionBtn('Lập học phí theo lớp','quick',k,id)}</div>`;
 if(k==='sessions'&&canWrite('attendance'))html+=`<div class="v85-quick-bar">${actionBtn('Tạo bảng điểm danh','quick',k,id)}</div>`;
 if(k==='exams'&&canWrite('results'))html+=`<div class="v85-quick-bar">${actionBtn('Nhập kết quả theo lớp','quick',k,id)}</div>`;
 if(k==='fees'&&canWrite('feeReceipts'))html+=`<div class="v85-quick-bar">${actionBtn('Thu số còn lại','quick',k,id)}</div>`;
 if(k==='orders'&&canWrite('orderReceipts'))html+=`<div class="v85-quick-bar">${actionBtn('Thu tiền đơn bán','quick',k,id)}</div>`;
 if(k==='loans'&&canWrite('loanReturns'))html+=`<div class="v85-quick-bar">${actionBtn('Ghi nhận trả dụng cụ','quick',k,id)}</div>`;
 html+='</section>';return html;
}
function openContextPanel(k,id){let r=find(k,id);if(!r)return toast('Không tìm thấy','Bản ghi không còn trong dữ liệu hiện tại.','warning');APP.state.activeDetail={key:k,id};APP.state.detailHistory=[];const content=`<div class="v85-context-info"><span>${esc(cfgOf(k).title)}</span><strong>${esc(id)}</strong></div>${relatedHtml(k,r)||'<p>Chưa có hồ sơ liên kết.</p>'}`;
 modal('Liên kết & thao tác nhanh',`${cfgOf(k).title} · ${id}`,content,`<button type="button" class="btn" data-action="close-modal">Đóng</button>`,'wide');}
function clearLinkedContext(){const ctx=APP.state.linkedContext;if(!ctx)return;const prev=ctx.previous||{};
 APP.state.filters[ctx.childKey]=prev.filters||{};APP.state.search[ctx.childKey]=prev.search||'';
 APP.state.pageNo[ctx.childKey]=prev.pageNo||1;APP.state.sort[ctx.childKey]=prev.sort||'newest';
 APP.state.pageSize[ctx.childKey]=prev.pageSize||12;if(prev.view&&APP.state._v48View)APP.state._v48View[ctx.childKey]=prev.view;
 APP.state.linkedContext=null;
}
function linkedContextBanner(k){const ctx=APP.state.linkedContext;if(!ctx||ctx.childKey!==k)return '';
 const live=dataOf(ctx.sourceKey).some(x=>String(x[cfgOf(ctx.sourceKey).id])===String(ctx.sourceId));
 return `<section class="v883-linked-banner" role="status"><div class="v883-link-description">${icon('link')}<div><strong>Đang xem liên kết: ${esc(ctx.sourceName)} (${esc(ctx.sourceId)})</strong><small>Chỉ hiện ${esc(cfgOf(k).title)} có ${esc(ctx.foreignKey)} = ${esc(ctx.sourceId)}. ${live?'':'Hồ sơ nguồn không còn trong dữ liệu hiện tại.'}</small></div></div><div class="v883-link-actions"><button type="button" class="btn btn-sm" data-action="v883-back-source">${icon('arrow_back')} Quay lại ${esc(cfgOf(ctx.sourceKey).title)} ${esc(ctx.sourceId)}</button><button type="button" class="btn btn-sm" data-action="v883-show-all">Xem tất cả</button></div></section>`;
}
function appendDetailBack(){const last=APP.state.detailHistory?.at(-1);if(!last)return;const footer=document.querySelector('#modal-root .modal-footer');if(!footer)return;
 footer.insertAdjacentHTML('afterbegin',`<button type="button" class="btn v883-detail-back" data-action="v883-detail-back">${icon('arrow_back')} Quay lại ${esc(cfgOf(last.key).title||last.key)} (${esc(last.id)})</button>`);
}
function showRelatedRecord(child,id){const parent=APP.state.activeDetail;
 if(!canRead(child))return toast('Không đủ quyền','Bạn không có quyền xem hồ sơ này.','warning');
 if(parent){APP.state.detailHistory??=[];APP.state.detailHistory.push({...parent});}
 viewRecord(child,id);appendDetailBack();
}
function backRelatedRecord(){const last=APP.state.detailHistory?.pop();if(!last)return;viewRecord(last.key,last.id);appendDetailBack();}
function goLinked(k,id,child,fk){const parent=find(k,id),cfg=cfgOf(child);if(!parent||!cfg.refs||cfg.refs[fk]!==k)return toast('Liên kết không hợp lệ','Không xác định được hồ sơ nguồn và cột liên kết.','warning');
 if(APP.state.linkedContext)clearLinkedContext();const previous={filters:{...(APP.state.filters[child]||{})},search:APP.state.search[child]||'',pageNo:APP.state.pageNo[child]||1,sort:APP.state.sort[child]||'newest',pageSize:APP.state.pageSize[child]||12,view:APP.state._v48View?.[child]};
 APP.state.linkedContext={sourceKey:k,sourceId:String(id),sourceName:String(parent[REF_NAME[k]||cfgOf(k).required?.[0]||cfgOf(k).id]||id),childKey:child,foreignKey:fk,previous,sourceScrollY:window.scrollY||0};
 closeModal();APP.state.filters[child]={};APP.state.search[child]='';APP.state.pageNo[child]=1;setPage(child,{force:true});
}
function exitLinkedList(){const ctx=APP.state.linkedContext;if(!ctx)return;clearLinkedContext();renderPage();}
function goBackLinkedSource(){const ctx=APP.state.linkedContext;if(!ctx)return;const {sourceKey,sourceId,sourceScrollY}=ctx;
 if(!canRead(sourceKey))return toast('Không đủ quyền','Bạn không có quyền mở hồ sơ nguồn.','warning');
 clearLinkedContext();setPage(sourceKey,{force:true});APP.state.restoreScrollOnClose=sourceScrollY;viewRecord(sourceKey,sourceId);
}

function seedFor(k,seed={}){const obj=makeWizardRow(k,seed);for(const f of editableFields(k)){if(DATE_DEFAULTS[f]&&!obj[f])obj[f]=stamp();}
 if(k==='parking'&&!obj['Giờ vào'])obj['Giờ vào']=timestamp();
 if(k==='feeReceipts'||k==='orderReceipts')obj['Trạng thái']=obj['Trạng thái']||'Nháp';
 return obj;
}
function defaultWizard(k,seed={}){newWizard(k,seedFor(k,seed));}
function fillWizardRows(k,items){
 if(!items.length)return toast('Danh sách trống','Chưa có thành viên phù hợp để tạo bản ghi.','warning');
 newWizard(k);const w=APP.state.wizard;w.rows=items.slice(0,50).map(v=>seedFor(k,v));w.files=w.rows.map(()=>[]);w.collapsed.clear();renderWizard();
 if(items.length>50)toast('Giới hạn mỗi lượt','Chỉ hiển thị 50 dòng đầu.','warning');
}
function quick(k,id){const r=find(k,id);if(!r)return;
 if(k==='parking')return openFormWithSeed('parking',id,{'Giờ ra':timestamp(),'Trạng thái':'Đã trả xe'});
 if(k==='tasks')return openFormWithSeed('tasks',id,{'Trạng thái':'Hoàn thành','Tiến độ':100});
 if(k==='classes'){
  const list=dataOf('memberships').filter(x=>String(x['Mã nhóm lớp'])===String(id)&&x['Trạng thái']==='Hoạt động');
  const fresh=list.map(m=>({'Mã người':m['Mã người'],'Mã nhóm lớp':id,'Kỳ học phí':String(new Date().getMonth()+1).padStart(2,'0')+'/'+new Date().getFullYear(),'Học phí gốc':r['Mức học phí']||''})).filter(x=>!dataOf('fees').some(f=>f['Mã người']===x['Mã người']&&f['Mã nhóm lớp']===id&&f['Kỳ học phí']===x['Kỳ học phí']));
  return fillWizardRows('fees',fresh);
 }
 if(k==='sessions'){
  const list=dataOf('memberships').filter(x=>x['Mã nhóm lớp']===r['Mã nhóm lớp']&&x['Trạng thái']==='Hoạt động');
  const fresh=list.filter(x=>!dataOf('attendance').some(a=>a['Mã buổi']===id&&a['Mã người']===x['Mã người'])).map(x=>({'Mã buổi':id,'Mã người':x['Mã người'],'Trạng thái điểm danh':''}));
  fillWizardRows('attendance',fresh);if(APP.state.wizard){APP.state.wizard.rows.forEach(x=>x['Trạng thái điểm danh']='');renderWizard();}return;
 }
 if(k==='exams'){
  const list=dataOf('memberships').filter(x=>x['Mã nhóm lớp']===r['Mã nhóm lớp']&&x['Trạng thái']==='Hoạt động');
  const fresh=list.filter(x=>!dataOf('results').some(a=>a['Mã kỳ thi']===id&&a['Mã người']===x['Mã người'])).map(x=>({'Mã kỳ thi':id,'Mã người':x['Mã người']}));return fillWizardRows('results',fresh);
 }
 if(k==='fees'){
  const due=Number(r['Phải thu']||0),paid=dataOf('feeReceipts').filter(x=>x['Mã khoản học phí']===id&&x['Trạng thái']==='Đã xác nhận').reduce((n,x)=>n+Number(x['Số tiền']||0),0),refund=dataOf('feeRefunds').filter(x=>x['Mã khoản học phí']===id&&['Đã duyệt','Đã xác nhận'].includes(x['Trạng thái'])).reduce((n,x)=>n+Number(x['Số tiền hoàn']||0),0);
  const left=Math.max(0,due-paid+refund);if(!left)return toast('Không còn số dư','Khoản học phí này không còn tiền phải thu.','warning');return defaultWizard('feeReceipts',{'Mã khoản học phí':id,'Ngày thu':stamp(),'Số tiền':left,'Trạng thái':'Nháp'});
 }
 if(k==='orders'){
  const due=Number(r['Còn nợ']||0);if(!due)return toast('Không còn công nợ','Đơn bán này hiện không có số dư phải thu.','warning');return defaultWizard('orderReceipts',{'Mã đơn bán':id,'Ngày thu':stamp(),'Số tiền':due,'Trạng thái':'Nháp'});
 }
 if(k==='loans'){
  const due=Math.max(0,Number(r['Số lượng mượn']||0)-Number(r['Số lượng đã trả']||0));if(!due)return toast('Đã trả đủ','Không còn dụng cụ phải trả.','warning');return defaultWizard('loanReturns',{'Mã phiếu mượn':id,'Ngày trả':stamp(),'Số lượng trả':due});
 }
}
function openFormWithSeed(k,id,seed){openForm(k,id);const f=APP.state.form;if(!f||f.key!==k)return;Object.assign(f.values,seed);const fields=editableFields(k);const body=`<div class="v85-context-banner">${icon('bolt')} Điền sẵn thao tác nhanh; chỉ cập nhật Google Sheet khi bấm Lưu dữ liệu.</div><div class="form-grid">${fields.map(x=>fieldInput(k,x,f.values[x]??'')).join('')}</div>${window.chuaV86?.singleFileArea?.(k)||''}`;
 const root=document.querySelector('.modal-body');if(root)root.innerHTML=body;
}
function createRelated(parentKey,id,child,fk,fromLinkedList=false){if(!canWrite(child))return;const parent=find(parentKey,id);if(!parent||cfgOf(child).refs?.[fk]!==parentKey)return toast('Không thể thêm liên kết','Hồ sơ nguồn không tồn tại hoặc trường liên kết không phù hợp.','warning');
 const ctx={sourceKey:parentKey,sourceId:String(id),sourceName:String(parent[REF_NAME[parentKey]||cfgOf(parentKey).required?.[0]||cfgOf(parentKey).id]||id),childKey:child,foreignKey:fk};
 const target={mode:fromLinkedList?'list':'source',key:parentKey,id:String(id),listKey:child,scrollY:window.scrollY||0};
 const seed={[fk]:id};if(child==='memberships')seed['Ngày tham gia']=stamp();
 if(child==='fees'){seed['Kỳ học phí']=String(new Date().getMonth()+1).padStart(2,'0')+'/'+new Date().getFullYear();const c=find('classes',parentKey==='classes'?id:parent?.['Mã nhóm lớp']);if(c){seed['Mã nhóm lớp']=c['Mã nhóm lớp'];seed['Học phí gốc']=c['Mức học phí']||0;}}
 if(child==='sessions'){seed['Ngày sinh hoạt']=stamp();seed['Địa điểm']=parent['Địa điểm']||'';seed['Mã nhân sự phụ trách']=parent['Mã nhân sự phụ trách']||'';}
 if(child==='tasks'){seed['Ngày giao']=stamp();seed['Ngày hạn']=stamp();seed['Mức ưu tiên']='Bình thường';}
 if(child==='feeReceipts'){seed['Ngày thu']=stamp();seed['Trạng thái']='Nháp';}
 if(child==='orderReceipts'){seed['Ngày thu']=stamp();seed['Trạng thái']='Nháp';}
 if(child==='loanReturns')seed['Ngày trả']=stamp();
 if(child==='trips')seed['Mã tài xế']=parent['Mã tài xế phụ trách']||'';
 if(child==='returns'&&parentKey==='orders')seed['Ngày đổi trả']=stamp();
 if(child==='memorials'&&parentKey==='slots'&&parent['Trạng thái']!=='Còn trống')return toast('Vị trí đang sử dụng','Hãy chọn vị trí còn trống.','warning');
 if(DOCUMENTS[child])return newDocument(child,seed);
 defaultWizard(child,seed);if(APP.state.wizard){APP.state.wizard.context=ctx;APP.state.wizardReturn=target;APP.state.wizard.dirty=false;renderWizard();}
}
function openNew(k){if(DOCUMENTS[k])return newDocument(k);if(k==='parking')return defaultWizard(k,{'Giờ vào':timestamp(),'Trạng thái':'Đang gửi'});return defaultWizard(k);}
function contextRecord(k,part,i){if(part==='grid')return APP.state.wizard?.rows?.[i]||{};if(part==='doc-parent')return APP.state.v85Document?.header||{};if(part==='doc-line')return APP.state.v85Document?.lines?.[i]||{};return APP.state.form?.values||{};}
function dependentOptions(k,field,opts,part,index){const state=contextRecord(k,part,index),q=(name,id)=>String(id||'')===String(name||'');let ids=null;
 if(k==='attendance'&&field==='Mã người'&&state['Mã buổi']){const s=find('sessions',state['Mã buổi']);if(s){ids=new Set(dataOf('memberships').filter(x=>x['Mã nhóm lớp']===s['Mã nhóm lớp']&&x['Trạng thái']!=='Kết thúc').map(x=>String(x['Mã người'])));}}
 if(k==='results'&&field==='Mã người'&&state['Mã kỳ thi']){const s=find('exams',state['Mã kỳ thi']);if(s)ids=new Set(dataOf('memberships').filter(x=>x['Mã nhóm lớp']===s['Mã nhóm lớp']).map(x=>String(x['Mã người'])));}
 if(k==='fees'&&field==='Mã người'&&state['Mã nhóm lớp'])ids=new Set(dataOf('memberships').filter(x=>x['Mã nhóm lớp']===state['Mã nhóm lớp']).map(x=>String(x['Mã người'])));
 if(k==='feeRefunds'&&field==='Mã thu học phí'&&state['Mã khoản học phí'])ids=new Set(dataOf('feeReceipts').filter(x=>x['Mã khoản học phí']===state['Mã khoản học phí']&&x['Trạng thái']==='Đã xác nhận').map(x=>String(x['Mã thu học phí'])));
 if(k==='returns'&&field==='Mã SKU trả'&&state['Mã đơn bán'])ids=new Set(dataOf('orderItems').filter(x=>x['Mã đơn bán']===state['Mã đơn bán']).map(x=>String(x['Mã SKU'])));
 if(k==='memorials'&&field==='Mã vị trí')ids=new Set(dataOf('slots').filter(x=>x['Trạng thái']==='Còn trống'||x['Mã vị trí']===state['Mã vị trí']).map(x=>String(x['Mã vị trí'])));
 return ids?opts.filter(x=>ids.has(String(x.value))):opts;
}
function fieldChanged(k,field,row,part,index){let follow=false;
 if(k==='orders'&&field==='Mã người mua'){const p=find('people',row[field]);if(p){row['Tên người mua']=p['Họ tên']||row['Tên người mua'];row['Số điện thoại']=p['Số điện thoại']||row['Số điện thoại'];follow=true;}}
 if(k==='sessions'&&field==='Mã nhóm lớp'){const c=find('classes',row[field]);if(c){row['Địa điểm']=row['Địa điểm']||c['Địa điểm'];row['Mã nhân sự phụ trách']=row['Mã nhân sự phụ trách']||c['Mã nhân sự phụ trách'];follow=true;}}
 if(k==='orderItems'||k==='purchaseItems'){if(field==='Mã SKU'){const sku=find('products',row[field]);if(sku){row[k==='orderItems'?'Đơn giá bán':'Đơn giá nhập']=Number(sku[k==='orderItems'?'Giá bán':'Giá nhập']||0);if(k==='orderItems')row['Size']=sku['Size']||'';follow=true;}}const price=Number(rawMoney(row[k==='orderItems'?'Đơn giá bán':'Đơn giá nhập'])||0),qty=Number(rawMoney(row['Số lượng'])||0);row['Thành tiền']=price*qty;}
 if(k==='fees'&&field==='Mã nhóm lớp'){const c=find('classes',row[field]);if(c&&(!row['Học phí gốc']||Number(row['Học phí gốc'])===0)){row['Học phí gốc']=c['Mức học phí']||0;follow=true;}}
 if(k==='loans'&&field==='Mã vật tư'){const s=find('supplies',row[field]);if(s&&row['Mã kho']!==undefined){row['Mã kho']=s['Mã kho'];follow=true;}}
 if(['attendance','results','fees','feeRefunds','returns'].includes(k)&&['Mã buổi','Mã kỳ thi','Mã nhóm lớp','Mã khoản học phí','Mã đơn bán'].includes(field))follow=true;
 if(part==='doc-parent'||part==='doc-line'){
  if(part==='doc-line'&&['Số lượng','Đơn giá nhập','Đơn giá bán','Mã SKU'].includes(field))refreshDocumentSum();
  if(follow&&(field==='Mã SKU'||(part==='doc-parent'&&field==='Mã người mua')))Promise.resolve().then(()=>{if(APP.state.v85Document)renderDocument();});
 }else if(follow&&part==='grid')Promise.resolve().then(()=>{if(APP.state.wizard&&APP.state.wizard.step===1)renderWizard();});
 else if(follow&&part==='single')Promise.resolve().then(()=>{if(APP.state.form?.key===k){const body=document.querySelector('.modal-body .form-grid');if(body)body.innerHTML=editableFields(k).map(f=>fieldInput(k,f,row[f]??'')).join('');}});
}
function groupedFields(k,r,i){
 const fields=editableFields(k),cfg=cfgOf(k),ref=fields.filter(f=>cfg.refs?.[f]),key=fields.filter(f=>!cfg.refs?.[f]&&!/^Trạng thái|Mã giao dịch tài chính|Ảnh File ID$/.test(f)),status=fields.filter(f=>!ref.includes(f)&&!key.includes(f));
 key.sort((a,b)=>Number((cfg.required||[]).includes(b))-Number((cfg.required||[]).includes(a)));
 const blocks=[['Hồ sơ liên kết',ref],['Thông tin nghiệp vụ',key],['Trạng thái & thông tin hệ thống',status]];
 return blocks.filter(([,f])=>f.length).map(([title,f])=>`<div class="v85-form-group"><div class="v85-form-heading">${icon(title==='Hồ sơ liên kết'?'account_tree':'description')}<strong>${esc(title)}</strong><small>${f.length} trường</small></div><div class="form-grid">${f.map(x=>fieldInput(k,x,r[x]??'',{part:'grid',index:i})).join('')}</div></div>`).join('');
}
/* Chứng từ: lưu cha+con nguyên một lượt, trạng thái luôn Nháp. */
function createLine(k){const spec=DOCUMENTS[k],p=cfgOf(spec.child),r={};editableFields(spec.child).forEach(x=>r[x]='');r[spec.fk]='(sẽ sinh khi lưu)';r['Số lượng']='1';return r;}
function newDocument(k,seed={}){if(!canWrite(k)||!canWrite(DOCUMENTS[k].child))return toast('Không đủ quyền','Không có quyền tạo cả chứng từ và dòng chi tiết.','warning');
 const header=seedFor(k,seed);header['Trạng thái']='Nháp';header['Tổng tiền']=0;if(k==='purchases')header['Đã thanh toán']=0;
 APP.state.v85Document={key:k,header,lines:[createLine(k)],files:[],step:1,saving:false,requestId:'r'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,12)};renderDocument();return true;}
function documentValues(d){const spec=DOCUMENTS[d.key],cfg=cfgOf(d.key),headErr=validateClient(d.key,d.header),lineErr=[];
 d.lines.forEach((l,i)=>{const v=validateClient(spec.child,l);if(!(Number(rawMoney(l['Số lượng'])||0)>0))v.push('Số lượng phải lớn hơn 0');if(v.length)lineErr.push('Dòng '+(i+1)+': '+v.join(', '));});
 if(d.key==='transfers'&&d.header['Mã kho xuất']&&d.header['Mã kho xuất']===d.header['Mã kho nhận'])headErr.push('Kho xuất và kho nhận phải khác nhau');
 return {headErr,lineErr};
}
function documentTotal(d){const s=DOCUMENTS[d.key];return d.lines.reduce((n,r)=>n+Number(rawMoney(r['Số lượng'])||0)*Number(rawMoney(r[s.price]||0)||0),0);}
function refreshDocumentSum(){const d=APP.state.v85Document,el=document.querySelector('[data-v85-document-total]');if(d&&el)el.textContent=money(documentTotal(d))+' đ';}
function renderDocument(){const d=APP.state.v85Document;if(!d)return;const cfg=cfgOf(d.key),spec=DOCUMENTS[d.key],c=cfgOf(spec.child),{headErr,lineErr}=documentValues(d);
 const steps=`<div class="workflow-steps v85-clickable-steps"><button type="button" class="${d.step===1?'active':''}" data-v85-doc-step="1">${icon('edit_note')} 1. Nhập liệu</button>${icon('chevron_right')}<button type="button" class="${d.step===2?'active':''}" data-v85-doc-step="2">${icon('fact_check')} 2. Kiểm tra</button></div>`;
 let body='';if(d.step===1){
 const parentFields=editableFields(d.key).filter(f=>!['Trạng thái','Tổng tiền','Còn nợ','Đã thu','Đã thanh toán'].includes(f));
 const lineFields=editableFields(spec.child).filter(f=>!['Thành tiền',spec.fk].includes(f));
 body=`<div class="v85-doc-note">${icon('info')} Tạo chứng từ và nhiều dòng chi tiết trong một lần. Chứng từ luôn lưu ở <b>Nháp</b>; chỉ xác nhận nhập/xuất kho sau khi kiểm tra lại chứng từ.</div>
 <div class="v85-form-group"><div class="v85-form-heading">${icon('receipt_long')} <strong>Thông tin chung</strong></div><div class="form-grid">${parentFields.map(f=>fieldInput(d.key,f,d.header[f]??'',{part:'doc-parent'})).join('')}</div></div>
 <div class="v85-form-group"><div class="v85-form-heading">${icon('inventory_2')} <strong>Danh sách ${d.key==='transfers'?'SKU chuyển kho':'sản phẩm'}</strong><small>${d.lines.length} dòng</small></div>
 <div class="v85-doc-tools"><button type="button" class="btn btn-sm" data-v85-doc-action="add" data-count="1">${icon('add')} Thêm dòng</button><button type="button" class="btn btn-sm" data-v85-doc-action="add" data-count="5">${icon('playlist_add')} Thêm 5 dòng</button><button type="button" class="btn btn-sm" data-v85-doc-action="remove-blank">${icon('delete_sweep')} Xóa dòng trống</button></div>
 ${d.lines.map((row,i)=>`<div class="v85-doc-line"><div class="v85-doc-line-head"><strong>#${i+1}</strong><span>${row['Mã SKU']?esc(lookup('products',row['Mã SKU'])):'Chưa chọn SKU'}</span><button type="button" class="btn btn-sm btn-danger" data-v85-doc-action="remove" data-i="${i}">${icon('delete')} Bỏ dòng</button></div><div class="form-grid">${lineFields.map(f=>fieldInput(spec.child,f,row[f]??'',{part:'doc-line',index:i})).join('')}</div></div>`).join('')}</div>
 <div class="v85-doc-total"><span>Tổng tiền tạm tính</span><strong data-v85-document-total>${money(documentTotal(d))} đ</strong></div>
 ${APP.permissions.canUpload?`<div class="v85-form-group"><div class="v85-form-heading">${icon('attach_file')} <strong>Tài liệu chứng từ</strong></div><div class="v86-file-actions"><label class="btn btn-sm">${icon('attach_file')} Chọn 1 / nhiều file<input type="file" data-v85-doc-files data-kind="Tài liệu liên quan" multiple accept="${WIZARD_FILE_ACCEPT}" hidden></label><label class="btn btn-sm">${icon('image')} Ảnh chứng từ<input type="file" data-v85-doc-files data-kind="Ảnh" multiple accept="image/*" hidden></label></div><div class="v86-file-list">${d.files.map((f,i)=>`<span>${icon(f._chuaKind==='Ảnh'?'image':'draft')} ${esc(f.name)} <button type="button" data-v86-doc-remove="${i}" aria-label="Bỏ file">×</button></span>`).join('')}</div><small>${d.files.length} file đang chờ upload · có thể chọn bổ sung nhiều lần, chỉ upload sau lưu</small></div>`:''}`;
 }else{
 const names={purchases:['Ngày nhập','Mã nhà cung cấp','Mã kho'],orders:['Ngày đặt','Tên người mua','Mã kho'],transfers:['Ngày chuyển','Mã kho xuất','Mã kho nhận']}[d.key];
 body=`<div class="wizard-review-summary"><div><small>Dòng chi tiết</small><strong>${d.lines.length}</strong></div><div><small>Tổng tiền tạm tính</small><strong>${money(documentTotal(d))}</strong></div><div><small>Cần kiểm tra</small><strong class="${headErr.length+lineErr.length?'text-danger':''}">${headErr.length+lineErr.length}</strong></div></div>
 <div class="v85-doc-note">${icon('verified')} Có thể xem bước này khi chưa nhập đủ. Chỉ bấm lưu khi không còn lỗi.</div>
 ${headErr.concat(lineErr).length?`<div class="wizard-error-summary">${[...headErr,...lineErr].map(v=>`<p>${esc(v)}</p>`).join('')}</div>`:''}
 <div class="v85-form-group"><div class="v85-form-heading">${icon('description')} <strong>Thông tin chung</strong></div><div class="v85-review-grid">${names.map(f=>`<div><small>${esc(f)}</small><strong>${esc(d.header[f]||'Chưa nhập')}</strong></div>`).join('')}</div></div>
 <div class="v85-form-group"><div class="v85-form-heading">${icon('list_alt')} <strong>${d.lines.length} dòng sản phẩm</strong></div><div class="v85-review-lines">${d.lines.map((r,i)=>`<div><b>#${i+1}</b> ${esc(lookup('products',r['Mã SKU']))} · SL: ${esc(r['Số lượng'])} ${spec.price?`· ${money(Number(rawMoney(r[spec.price])||0)*Number(rawMoney(r['Số lượng'])||0))} đ`:''}</div>`).join('')}</div></div>
 <div class="v85-doc-note">${icon('lock')} Sau khi lưu, phiếu ở trạng thái Nháp. Xác nhận kho là thao tác riêng có kiểm tra tồn và quyền truy cập.</div>`;
 }
 const footer=d.step===1?`<button class="btn" data-action="close-modal">Hủy</button><button class="btn btn-primary" data-v85-doc-step="2">Tiếp tục kiểm tra ${icon('arrow_forward')}</button>`:`<button class="btn" data-v85-doc-step="1">${icon('arrow_back')} Quay lại nhập liệu</button><button class="btn btn-primary" data-v85-doc-action="save" ${d.saving||headErr.length||lineErr.length?'disabled':''}>${icon('save')} Lưu chứng từ nháp</button>`;
 modal(`Thêm ${cfg.title}`,`Quy trình chứng từ có bảng chi tiết · ${d.step===1?'Nhập liệu':'Kiểm tra và xác nhận'}`,steps+body,footer,'xwide');
}
async function saveDocument(){const d=APP.state.v85Document;if(!d||d.saving)return;const errors=documentValues(d);if(errors.headErr.length||errors.lineErr.length)return toast('Thiếu thông tin',errors.headErr.concat(errors.lineErr).slice(0,3).join('; '),'warning');
 d.saving=true;renderDocument();const t=toast('Đang lưu chứng từ','Ghi thông tin chung và chi tiết trong cùng một lệnh máy chủ.','processing',0);
 try{const result=await gas('createDraftDocument',d.key,d.header,d.lines,d.requestId,{timeout:120000});applyServerPatches(result.patches);mergeRow(d.key,result.parent);result.lines.forEach(x=>mergeRow(DOCUMENTS[d.key].child,x));const saved=[result.parent],files=[d.files.slice()];APP.state.v85Document=null;closeModal();renderPage();toastUpdate(t,'Đã tạo chứng từ nháp',`${result.parent[cfgOf(d.key).id]} · ${result.lines.length} dòng. Cần xác nhận thủ công trước khi ghi kho.`, 'success',7500);scheduleWizardUploads(d.key,saved,files);
 }catch(e){d.saving=false;renderDocument();toastUpdate(t,'Lưu chứng từ thất bại',e.message,'error',9500);}
}
function setupListeners(){
 document.addEventListener('click',function(e){const target=e.target.closest('[data-v85-context],[data-v85-panel],[data-v85-step],[data-v85-category-step],[data-v85-doc-step],[data-v85-doc-action],[data-v86-doc-remove]');if(!target)return;e.preventDefault();e.stopImmediatePropagation();
 try{
 if(target.hasAttribute('data-v86-doc-remove')){const d=APP.state.v85Document;if(d&&!d.saving){d.files.splice(Number(target.dataset.v86DocRemove),1);d.dirty=true;renderDocument();}return;}
 if(target.hasAttribute('data-v85-step')){const w=APP.state.wizard;if(w&&!w.saving){w.step=Number(target.dataset.v85Step);if(w.step===2)w.reviewed=true;renderWizard();}return;}
 if(target.hasAttribute('data-v85-category-step')){const f=APP.state.form;if(f?.mode==='category'&&!f.old){if(f.step===1){f.text=document.getElementById('cat-values-multi')?.value||f.text||'';f.values=categoryValuesFromText(f.text);}f.step=Number(target.dataset.v85CategoryStep);renderCategoryWizard();}return;}
 if(target.hasAttribute('data-v85-panel'))return openContextPanel(target.dataset.v85Panel,target.dataset.id);
 if(target.hasAttribute('data-v85-doc-step')){const d=APP.state.v85Document;if(d&&!d.saving){d.step=Number(target.dataset.v85DocStep);renderDocument();}return;}
 if(target.hasAttribute('data-v85-doc-action')){const d=APP.state.v85Document;if(!d||d.saving)return;const op=target.dataset.v85DocAction;
 if(op==='add'){const n=Math.min(Number(target.dataset.count)||1,30-d.lines.length);for(let i=0;i<n;i++)d.lines.push(createLine(d.key));}
 if(op==='remove'){d.lines.splice(Number(target.dataset.i),1);if(!d.lines.length)d.lines.push(createLine(d.key));}
 if(op==='remove-blank'){d.lines=d.lines.filter(x=>!!x['Mã SKU']||Number(rawMoney(x['Số lượng'])||0)!==1);if(!d.lines.length)d.lines=[createLine(d.key)];}
 if(op==='save')return saveDocument();d.dirty=true;renderDocument();return;}
 const kind=target.dataset.v85Context,k=target.dataset.v85Key,id=target.dataset.v85Id,child=target.dataset.v85Child,fk=target.dataset.v85Fk;
 if(kind==='view')return showRelatedRecord(child,id);if(kind==='list')return goLinked(k,id,child,fk);if(kind==='create')return createRelated(k,id,child,fk);if(kind==='quick')return quick(k,id);
 }catch(error){console.error('V8.5 action',error);toast('Không thể thao tác',error.message,'error');}
 },true);
 document.addEventListener('change',function(e){const node=e.target;if(node.matches('[data-v85-doc-files]')){const d=APP.state.v85Document;if(!d)return;const valid=[...node.files].filter(f=>f.size>0&&f.size<=12*1024*1024&&WIZARD_MIME.test(f.type));const existing=new Set(d.files.map(f=>f.name+'|'+f.size+'|'+f.lastModified));for(const file of valid){const sig=file.name+'|'+file.size+'|'+file.lastModified;if(!existing.has(sig)&&d.files.length<10){file._chuaKind=node.dataset.kind||'Tài liệu liên quan';d.files.push(file);d.dirty=true;existing.add(sig);}}renderDocument();if(valid.length!==node.files.length)toast('Một số file không hợp lệ','Chỉ chọn các định dạng tài liệu được hỗ trợ, tối đa 12 MB/file.','warning');}},true);
}
window.chuaV85={clearLinkedContext,openNew,showRelatedRecord,backRelatedRecord,createRelated,goBackLinkedSource,exitLinkedList,linkedContextBanner,hasLinks:k=>Boolean(LINKS[k]?.length||Object.keys(cfgOf(k).refs||{}).length||['parking','tasks'].includes(k)),relatedHtml,dependentOptions,fieldChanged,groupedFields,newDocument};
setupListeners();
})();

/* ===== V8.6 Section ===== */
/* V8.6 Progressive UI: media controls, thumbnails, reporting tabs.
 * A separate compile unit inside JavaScript.html. No GAS calls on startup.
 */
(function(){
'use strict';
const VISUAL=new Set(['people','products','parking','memorials','slots','assets','supplies','events','guests','vehicles']);
const MEDIA_MAX=10;
const accepts=file=>file&&file.size>0&&file.size<=12*1024*1024&&(/^(image\/(jpeg|png|webp|gif)|application\/(pdf|msword|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet))|text\/(plain|csv))$/i.test(file.type)||/\.(pdf|docx?|xlsx?|csv|txt)$/i.test(file.name));
const fileSignature=f=>[f.name,f.size,f.lastModified].join('|');
function fileChips(files){return files.map((f,i)=>`<span class="v86-file-chip">${icon(f._chuaKind==='Ảnh'?'image':'description')}<span title="${att(f.name)}">${esc(f.name)}</span><small>${f._chuaKind==='Ảnh'?'Ảnh':'Tài liệu'}</small><button type="button" data-v86-form-remove="${i}" title="Bỏ file">×</button></span>`).join('');}
function singleFileArea(k){if(!APP.permissions?.canUpload||!canWrite(k)||k==='users')return '';
 const visual=VISUAL.has(k),files=APP.state.form?.files||[];
 const photoCount=files.filter(f=>f._chuaKind==='Ảnh').length,docCount=files.length-photoCount;
 const makeButton=(kind,multiple,label,ico)=>`<button type="button" class="btn btn-sm" data-v86-form-pick="${kind}" data-multiple="${multiple?'1':'0'}">${icon(ico)} ${label}</button>`;
 const card=(ico,name,description,actions)=>`<div class="v86-drop-card"><div class="v881-drop-card-heading"><span class="v881-media-icon">${icon(ico)}</span><div><b>${name}</b><small>${description}</small></div></div><div class="v86-upload-buttons">${actions}</div></div>`;
 const photos=card('image','Ảnh hồ sơ',`${photoCount} ảnh đã chọn · JPG, PNG, WebP, GIF`,makeButton('Ảnh',false,'1 ảnh','add_photo_alternate')+makeButton('Ảnh',true,'Nhiều ảnh','collections'));
 const documents=card('description',visual?'Tài liệu liên quan':'Tài liệu đính kèm',`${docCount} file đã chọn · PDF, Word, Excel, TXT, ảnh scan`,makeButton('Tài liệu liên quan',false,'1 file','attach_file')+makeButton('Tài liệu liên quan',true,'Nhiều file','drive_folder_upload'));
 return `<section class="v86-attachment-panel v881-upload-panel"><div class="v86-attachment-heading">${icon('drive_folder_upload')} <strong>${visual?'Ảnh & tài liệu liên quan':'Tài liệu đính kèm'}</strong><small>${files.length}/${MEDIA_MAX} file</small></div>
 <div class="v86-upload-grid ${visual?'':'v881-doc-only'}">${visual?photos:''}${documents}</div>
 <div class="v86-file-list v881-upload-files" data-v86-form-list>${fileChips(files)}</div><p class="v881-upload-note">Có thể chọn bổ sung nhiều lần · Tối đa ${MEDIA_MAX} file, 12 MB/file · Upload sau khi lưu hồ sơ.</p></section>`;
}
window.chuaV86={visualModules:VISUAL,singleFileArea};
function showFiles(){const el=document.querySelector('[data-v86-form-list]');if(!el)return;el.innerHTML=fileChips(APP.state.form?.files||[]);const s=document.querySelector('.v86-attachment-heading small');if(s)s.textContent=`${APP.state.form?.files?.length||0}/${MEDIA_MAX} file`;}
document.addEventListener('click',function(e){
 const node=e.target.closest('[data-v86-form-pick],[data-v86-form-remove]');if(!node)return;
 e.preventDefault();e.stopImmediatePropagation();const form=APP.state.form;if(!form||form.mode!=='record')return;
 if(node.hasAttribute('data-v86-form-remove')){form.files?.splice(Number(node.dataset.v86FormRemove),1);showFiles();return;}
 const kind=node.dataset.v86FormPick,inp=document.createElement('input');inp.type='file';inp.style.display='none';inp.multiple=node.dataset.multiple==='1';inp.accept=kind==='Ảnh'?'image/png,image/jpeg,image/webp,image/gif':WIZARD_FILE_ACCEPT;
 document.body.appendChild(inp);inp.addEventListener('change',()=>{
   if(APP.state.form!==form){inp.remove();return;}
   const signatures=new Set((form.files||[]).map(fileSignature));let rejected=0;for(const file of Array.from(inp.files||[])){
     const sig=fileSignature(file);if(!accepts(file)||signatures.has(sig)||form.files.length>=MEDIA_MAX||(kind==='Ảnh'&&!file.type.startsWith('image/'))){rejected++;continue;}
     file._chuaKind=kind;form.files.push(file);signatures.add(sig);
   }
   if(rejected)toast('Đã bỏ qua file không hợp lệ',`${rejected} file bị trùng, quá 12 MB hoặc vượt giới hạn ${MEDIA_MAX} file.`, 'warning');showFiles();inp.remove();
 },{once:true});inp.click();
},true);
// Thumbnail images are optional: no mass Drive operations while navigating tabs.
const photoCache=new Map();const pending=new Set();
function fileFor(k,r){
 let module=k,row=r;
 if(k==='slots'){const m=dataOf('memorials').find(x=>String(x['Mã vị trí'])===String(r['Mã vị trí'])&&!['Kết thúc','Đã hủy'].includes(x['Trạng thái']));if(!m)return '';module='memorials';row=m;}
 const cfg=cfgOf(module),id=String(row[cfg.id]||'');
 if(!id)return '';
 const photos=dataOf('files').filter(f=>f['Phân hệ']===cfg.sheet&&String(f['Mã bản ghi liên kết'])===id&&String(f['MIME type']||'').startsWith('image/')&&f['Trạng thái']!=='Đã xóa');
 const preferred=photos.find(f=>String(f['Loại tài liệu']||'').includes('Ảnh'))||photos[0];
 return preferred?.['File ID']||row['Ảnh File ID']||'';
}
function decoratePhotos(k){if(!VISUAL.has(k)||!canRead(k)||APP.state.page!==k)return;
 const shell=document.querySelector('#page-content .v48-shell');if(!shell)return;
 const refs=new Set(),cfg=cfgOf(k);if(!cfg.id)return;
 shell.querySelectorAll('.v48-entity-card').forEach(card=>{
   const id=card.querySelector('[data-v48-check]')?.value||card.querySelector('[data-action="view-row"]')?.dataset.id;
   const r=dataOf(k).find(x=>String(x[cfg.id])===String(id));if(!r)return;
   const f=fileFor(k,r),iconNode=card.querySelector('.v48-card-icon');if(!iconNode)return;
   iconNode.classList.add('v86-photo-icon');if(f){iconNode.innerHTML=`<span data-v86-photo="${att(f)}">${icon('photo_library')}</span>`;refs.add(f);}
   else iconNode.innerHTML=icon(k==='memorials'||k==='slots'?'spa':'image');
 });
 const table=shell.querySelector('table.v48-data-table');if(table){const head=table.querySelector('thead tr');if(head&&!head.querySelector('.v86-photo-col'))head.insertAdjacentHTML('afterbegin','<th class="v86-photo-col">Ảnh</th>');
   table.querySelectorAll('tbody tr').forEach(rowEl=>{
     if(rowEl.querySelector('.v86-photo-cell'))return;const id=rowEl.querySelector('[data-v48-check]')?.value;const r=dataOf(k).find(x=>String(x[cfg.id])===String(id));if(!r)return;
     const f=fileFor(k,r);rowEl.insertAdjacentHTML('afterbegin',`<td class="v86-photo-cell"><span class="v86-table-photo" ${f?`data-v86-photo="${att(f)}"`:''}>${icon(k==='memorials'||k==='slots'?'spa':'photo')}</span></td>`);if(f)refs.add(f);
   });
 }
 fillPhotos([...refs].slice(0,6));
}
function paintPhoto(id){const val=photoCache.get(id);if(!val)return;
 document.querySelectorAll('[data-v86-photo]').forEach(el=>{if(el.dataset.v86Photo!==id)return;
   const img=document.createElement('img');img.alt='Ảnh đính kèm hồ sơ';img.loading='lazy';img.decoding='async';img.src=val;el.replaceChildren(img);});
}
async function fillPhotos(ids){if(!ids.length)return;const todo=ids.filter(id=>!photoCache.has(id)&&!pending.has(id));ids.forEach(paintPhoto);
 if(!todo.length)return;todo.forEach(x=>pending.add(x));try{
   const results=await gas('getSmallImagePreviews',todo,{timeout:40000});
   todo.forEach(id=>{photoCache.set(id,results?.[id]||null);if(photoCache.size>30)photoCache.delete(photoCache.keys().next().value);});ids.forEach(paintPhoto);
 }catch(e){console.warn('Thumbnail lazy load:',e.message);}finally{todo.forEach(x=>pending.delete(x));}
}
const prevModule=window.renderModule;
window.renderModule=function(k){const result=prevModule(k);try{decoratePhotos(k);const shell=document.querySelector('#page-content .page-shell');const anchor=shell?.querySelector('.page-head');if(anchor&&APP.state.linkedContext?.childKey===k)anchor.insertAdjacentHTML('afterend',window.chuaV85?.linkedContextBanner?.(k)||'');}catch(e){console.warn('Visual cards:',e.message);}return result;};
// Add attachment list to detail view using already loaded metadata (no server fetch).
const oldView=window.viewRecord;
window.viewRecord=function(k,id){oldView(k,id);try{
 if(!VISUAL.has(k)||!canRead(k))return;const cfg=cfgOf(k),media=dataOf('files').filter(f=>f['Phân hệ']===cfg.sheet&&String(f['Mã bản ghi liên kết'])===String(id)&&f['Trạng thái']!=='Đã xóa');
 const body=document.querySelector('#modal-root .modal-body');if(!body)return;
 const photo=media.filter(f=>String(f['MIME type']).startsWith('image/'));
 if(media.length)body.insertAdjacentHTML('beforeend',`<section class="v86-attachment-panel"><div class="v86-attachment-heading">${icon('collections')} <strong>Ảnh và tài liệu liên quan</strong><small>${media.length} file</small></div><div class="v86-related-files">${media.map(f=>`<button type="button" class="btn btn-sm" data-action="view-file" data-id="${att(f['Mã tài liệu'])}">${icon(String(f['MIME type']).startsWith('image/')?'image':'draft')} ${esc(f['Tên file'])}</button>`).join('')}</div></section>`);
}catch(e){console.warn('Record media:',e.message);}};

/* Dashboard V8.7 được dựng duy nhất trong DashboardInsights bên trên; không chèn báo cáo phụ. */
window.__CHUA_V86_READY=true;
})();
/* ===== V8.8.2 Section ===== */
'use strict';
/* V8.8.2 – Email Center. Lazy loaded, not part of auth/bootstrap. */
window.EmailCenter=(function(){
  const TABS=[['overview','Tổng quan','dashboard'],['items','Việc cần nhắc','list_alt'],['recipients','Người nhận & gửi','group'],['preview','Xem trước email','preview'],['settings','Thiết lập tự động','settings'],['history','Lịch sử gửi','history']];
  const TYPES=[['tasks','Công việc'],['events','Sự kiện'],['intakes','Tiếp nhận'],['fees','Học phí'],['maintenance','Bảo dưỡng'],['warranty','Bảo hành']];
  const ROLES=[['Admin','Quản trị viên'],['Quản lý','Quản lý'],['Nhân sự','Nhân sự']];
  const state={loaded:false,loading:false,error:'',payload:null,tab:'overview',selected:new Set(),query:'',recipientFilter:'all',previewEmail:'',preview:null,working:false};
  function e(v){return esc(v??'');}
  function num(n){return Number(n||0).toLocaleString('vi-VN');}
  function button(action,label,cls='',extra=''){return `<button type="button" class="btn ${cls}" data-action="${action}" ${extra}>${label}</button>`;}
  function cfg(){return state.payload?.config||{};}
  function p(){return state.payload||{};}
  function recipients(){return (p().report?.recipients||[]).filter(x=>x.count>0);}
  function statuses(){const reports=p().report||{};return reports.summary||{late:0,today:0,soon:0,approval:0};}
  function staticShell(body){return `<div class="page-shell ec-center">${head('Quản lý Email nhắc việc','Xem việc cần nhắc, đối chiếu người nhận và kiểm soát email tổng hợp tự động.')}<div class="ec-top-note">${icon('verified_user')} Chỉ Admin/Quản lý được truy cập. Xem trước và chỉnh thiết lập không gửi thư. Gửi thủ công luôn yêu cầu xác nhận.</div>${body}</div>`;}
  function render(){if(!canPage('emailCenter'))return setPage('dashboard');
    if(!state.loaded){htmlEl('page-content',staticShell(`<section class="ec-loading"><span class="material-symbols-rounded">sync</span><strong>${state.loading?'Đang lấy dữ liệu email…':state.error?'Không tải được: '+e(state.error):'Đang chuẩn bị trung tâm email…'}</strong><p>Dữ liệu chỉ được tải khi mở trang này, không ảnh hưởng khởi động Web App.</p>${button('ec-refresh','Thử lại','')}</section>`));if(!state.loading&&!state.error)load();return;}
    const info=p(),active=Boolean(cfg().enabled&&info.trigger?.hasTrigger);const labels=TABS.map(([id,n,ic])=>`<button type="button" class="ec-tab ${state.tab===id?'active':''}" role="tab" aria-selected="${state.tab===id}" data-action="ec-tab" data-tab="${id}">${icon(ic)} ${e(n)}</button>`).join('');
    const top=`<div class="ec-head"><div class="ec-head-summary"><span class="ec-status ${active?'ready':'inactive'}">${icon(active?'check_circle':'warning')} ${active?'Đang bật lịch tự động':cfg().enabled?'Chưa cài lịch tự động':'Đang tắt gửi tự động'}</span><span>${e(info.timezone||'Asia/Ho_Chi_Minh')} · ${String(cfg().hour??8).padStart(2,'0')}:00–${String(cfg().hour??8).padStart(2,'0')}:59</span><span>Hạn mức hiện còn: <strong>${num(info.quota)}</strong> người nhận</span></div><div class="ec-head-actions">${button('ec-refresh',icon('refresh')+' Làm mới','')}${button('ec-test',icon('mark_email_read')+' Gửi thử cho tôi','')}</div></div><nav class="ec-tabs" role="tablist">${labels}</nav>`;
    const view=state.tab==='overview'?overview():state.tab==='items'?items():state.tab==='recipients'?people():state.tab==='preview'?preview():state.tab==='settings'?settings():history();
    htmlEl('page-content',staticShell(top+'<section class="ec-content">'+view+'</section>'));
  }
  async function load(){if(state.loading)return;state.loading=true;
    try{const data=await gas('getReminderEmailCenterData',{timeout:85000});state.payload=data;state.loaded=true;state.error='';
      const allowed=new Set(recipients().map(r=>r.email));state.selected=new Set([...state.selected].filter(x=>allowed.has(x)));if(!state.previewEmail&&recipients().length)state.previewEmail=recipients()[0].email;
    }catch(err){state.error=err.message;toast('Không tải được Email Center',err.message,'error',7000);}
    finally{state.loading=false;if(APP.state.page==='emailCenter')render();}
  }
  function counters(){const s=statuses(),eligible=p().report?.eligibleCount||0;return `<div class="ec-kpis">${[['mail','Email dự kiến',eligible,'Có nội dung cần nhắc'],['priority_high','Quá hạn',s.late,'Cần xử lý'],['today','Đến hạn hôm nay',s.today,'Nhắc trong ngày'],['hourglass_top','Sắp đến hạn',s.soon,'Trong '+(cfg().daysAhead||7)+' ngày'],['pending_actions','Chờ xác nhận',s.approval,'Chờ duyệt / phản hồi']].map(([i,t,v,desc])=>`<div class="ec-kpi"><span class="ec-kpi-ico">${icon(i)}</span><div><small>${e(t)}</small><strong>${num(v)}</strong><em>${e(desc)}</em></div></div>`).join('')}</div>`;}
  function overview(){let r=recipients(),logs=p().logs||[],sent=logs.filter(x=>x.status==='Thành công').length,fail=logs.filter(x=>['Cần kiểm tra','Thất bại'].includes(x.status)).length;
    return counters()+`<div class="ec-columns"><section class="ec-panel"><div class="ec-panel-head"><h3>Phân bổ người nhận</h3>${button('ec-tab','Xem danh sách '+icon('arrow_forward'),'btn-sm','data-tab="recipients"')}</div>${r.length?r.slice(0,8).map(x=>`<div class="ec-person-row"><span>${e(x.name)} <small>${e(x.email)} · ${e(x.role)}</small></span><strong>${num(x.count)} mục</strong></div>`).join(''):'<p class="ec-empty">Chưa có người nhận đủ điều kiện.</p>'}</section><section class="ec-panel"><div class="ec-panel-head"><h3>Tình trạng vận hành</h3></div><div class="ec-detail"><span>Thời gian gửi</span><strong>${String(cfg().hour??8).padStart(2,'0')}:00–${String(cfg().hour??8).padStart(2,'0')}:59 mỗi ngày được chọn</strong></div><div class="ec-detail"><span>Lịch tự động hiện thấy</span><strong>${num(p().trigger?.count)} trigger</strong></div><div class="ec-detail"><span>Nhật ký thành công (150 lần gần nhất)</span><strong>${num(sent)}</strong></div><div class="ec-detail"><span>Nhật ký cần kiểm tra</span><strong>${num(fail)}</strong></div><p class="ec-notice">Mẫu thư không chứa đường link hoặc nút mở Web App. Lịch gửi chạy độc lập trên Google Apps Script.</p></section></div><section class="ec-panel"><div class="ec-panel-head"><h3>Những mục sắp được nhắc</h3>${button('ec-tab','Xem tất cả '+icon('arrow_forward'),'btn-sm','data-tab="items"')}</div>${itemsTable((p().report?.items||[]).slice(0,8))}</section>`;}
  function itemsTable(arr){if(!arr.length)return '<p class="ec-empty">Không có nội dung cần nhắc theo thiết lập hiện tại.</p>';
    const bucket={'late':'Quá hạn','today':'Hôm nay','soon':'Sắp hạn','approval':'Chờ xác nhận'};
    return `<div class="ec-table-wrap"><table class="ec-table"><thead><tr><th>Phân hệ / Mã</th><th>Nội dung</th><th>Người phụ trách</th><th>Hạn</th><th>Nhóm nhắc</th><th>Trạng thái</th></tr></thead><tbody>${arr.map(x=>`<tr><td><b>${e(x.section)}</b><small>${e(x.id)}</small></td><td>${e(x.title)}</td><td>${e(x.ownerName)}</td><td>${e(x.due||'—')}</td><td><span class="ec-pill ${e(x.bucket)}">${e(bucket[x.bucket]||x.bucket)}</span></td><td>${e(x.state)}</td></tr>`).join('')}</tbody></table></div>`;}
  function visibleItems(){let arr=p().report?.items||[];const q=norm(state.query);return q?arr.filter(x=>norm([x.title,x.id,x.section,x.ownerName,x.state].join(' ')).includes(q)):arr;}
  function items(){let arr=visibleItems();return `<section class="ec-panel"><div class="ec-panel-head"><div><h3>Danh sách việc cần nhắc</h3><p>Nội dung hợp lệ theo loại nhắc đã bật; không gửi thư từ màn hình này.</p></div><span>${num(arr.length)} mục</span></div><label class="ec-filter">${icon('search')} <input type="search" placeholder="Tìm mã, nội dung, người phụ trách..." data-ec-search value="${att(state.query)}"></label><div id="ec-items-results">${itemsTable(arr.slice(0,200))}${arr.length>200?'<p class="ec-footnote">Đang hiển thị 200 mục đầu, hãy tìm kiếm để thu hẹp danh sách.</p>':''}</div></section>`;}
  function people(){const list=recipients();return `<section class="ec-panel"><div class="ec-panel-head"><div><h3>Người nhận và gửi thủ công</h3><p>Chọn một hoặc nhiều địa chỉ. Mỗi người chỉ nhận một bản tổng hợp trong ngày.</p></div><span class="ec-selected">${state.selected.size} đã chọn</span></div><div class="ec-tools">${button('ec-select-all','Chọn tối đa 20 người đủ điều kiện','')}${button('ec-select-none','Bỏ chọn','')}${button('ec-send',icon('send')+' Gửi cho người đã chọn','btn-primary',state.selected.size?'':'disabled')}</div><div class="ec-table-wrap"><table class="ec-table"><thead><tr><th width="50">Chọn</th><th>Người nhận</th><th>Vai trò</th><th>Email</th><th>Số mục</th><th>Thao tác</th></tr></thead><tbody>${list.map(x=>`<tr><td><input type="checkbox" data-ec-check="${att(x.email)}" ${state.selected.has(x.email)?'checked':''}></td><td><strong>${e(x.name)}</strong></td><td>${e(x.role)}</td><td>${e(x.email)}</td><td>${num(x.count)}</td><td><button class="btn btn-sm" type="button" data-action="ec-preview" data-email="${att(x.email)}">${icon('visibility')} Xem trước</button></td></tr>`).join('')||'<tr><td colspan="6">Không có người nhận đủ điều kiện</td></tr>'}</tbody></table></div><p class="ec-notice">Bấm Gửi thủ công sẽ xuất hiện bước xác nhận. Không tự gửi lại những địa chỉ đã ghi thành công hoặc chưa rõ kết quả trong hôm nay.</p></section>`;}
  function preview(){let opts=recipients(),current=opts.find(x=>x.email===state.previewEmail)||opts[0];return `<section class="ec-panel"><div class="ec-panel-head"><div><h3>Xem trước email HTML</h3><p>Xem nội dung đúng theo người nhận và quyền được cấp.</p></div></div><div class="ec-tools"><label for="ec-email-choice">Chọn người nhận</label><select id="ec-email-choice" data-ec-choice>${opts.map(r=>`<option value="${att(r.email)}" ${r.email===current?.email?'selected':''}>${e(r.name)} · ${e(r.email)} (${r.count} mục)</option>`).join('')}</select>${button('ec-load-preview',icon('visibility')+' Xem nội dung','btn-primary',current?'':'disabled')}</div>${state.preview?.email===current?.email?`<div class="ec-preview-subject"><strong>${e(state.preview.subject)}</strong><small>Gửi đến ${e(state.preview.email)} · ${num(state.preview.count)} mục</small></div><iframe sandbox="" title="Nội dung email xem trước" class="ec-iframe" srcdoc="${att(state.preview.html)}"></iframe>`:'<p class="ec-empty">Chọn người nhận và bấm Xem nội dung. Chức năng này không gửi email.</p>'}</section>`;}
  function checkList(field,opts,checked){return `<div class="ec-choice-grid">${opts.map(([value,label])=>`<label><input type="checkbox" data-ec-opt="${field}" value="${att(value)}" ${checked.includes(value)?'checked':''} ${p().canEditSettings?'':'disabled'}><span>${e(label)}</span></label>`).join('')}</div>`;}
  function settings(){const c=cfg();return `<section class="ec-panel ec-settings"><div class="ec-panel-head"><div><h3>Cấu hình nhắc tự động</h3><p>Chỉ Admin có thể sửa thiết lập và tạo/hủy trigger thời gian. Người quản lý có quyền xem.</p></div></div><div class="ec-settings-head"><label class="ec-toggle"><input type="checkbox" id="ec-enabled" ${c.enabled?'checked':''} ${p().canEditSettings?'':'disabled'}> <strong>Kích hoạt gửi email tự động</strong></label><span>Trigger hiện thấy: ${num(p().trigger?.count)}</span></div><div class="ec-form-row"><label>Giờ gửi mỗi ngày (giờ Việt Nam)<select id="ec-hour" ${p().canEditSettings?'':'disabled'}>${Array.from({length:16},(_,i)=>i+5).map(h=>`<option value="${h}" ${Number(c.hour)===h?'selected':''}>${String(h).padStart(2,'0')}:00–${String(h).padStart(2,'0')}:59</option>`).join('')}</select></label><label>Nhắc trước hạn (ngày)<input id="ec-days" type="number" min="1" max="30" value="${c.daysAhead}" ${p().canEditSettings?'':'disabled'}></label></div><h4>Ngày gửi trong tuần</h4>${checkList('weekdays',[['1','Thứ hai'],['2','Thứ ba'],['3','Thứ tư'],['4','Thứ năm'],['5','Thứ sáu'],['6','Thứ bảy'],['7','Chủ nhật']],(c.weekdays||[]).map(String))}<h4>Nhóm nội dung được nhắc</h4>${checkList('scopes',TYPES,c.scopes||[])}<h4>Vai trò được nhận</h4>${checkList('roles',ROLES,c.roles||[])}<p class="ec-notice">Thay đổi chỉ có hiệu lực sau khi bấm Lưu thiết lập. Google Apps Script có thể thực thi trong khoảng giờ đã chọn, không bảo đảm đúng phút.</p>${p().canEditSettings?`<div class="ec-form-footer">${button('ec-save-settings',icon('save')+' Lưu thiết lập & cập nhật lịch gửi','btn-primary')}</div>`:''}</section>`;}
  function history(){const list=p().logs||[];return `<section class="ec-panel"><div class="ec-panel-head"><div><h3>Lịch sử gửi email</h3><p>150 lần gửi gần nhất theo nhật ký; hiển thị trạng thái gửi và lỗi khi có.</p></div>${button('ec-history','Mở tab Lịch sử email '+icon('arrow_forward'),'btn-sm')}</div><div class="ec-table-wrap"><table class="ec-table"><thead><tr><th>Ngày gửi</th><th>Người nhận</th><th>Tiêu đề</th><th>Số mục</th><th>Trạng thái</th><th>Lỗi</th></tr></thead><tbody>${list.map(x=>`<tr><td>${e(x.date)}</td><td>${e(x.email)}</td><td>${e(x.subject)}</td><td>${num(x.count)}</td><td><span class="ec-pill ${x.status==='Thành công'?'done':x.status==='Đang gửi'?'approval':'late'}">${e(x.status)}</span></td><td>${e(x.error||'—')}</td></tr>`).join('')||'<tr><td colspan="6">Chưa có lịch sử gửi</td></tr>'}</tbody></table></div></section>`;}
  async function action(act,el){if(!APP.permissions.canSendEmails)return toast('Không đủ quyền','Chỉ Admin hoặc Quản lý có thể quản lý email.','warning');
    if(act==='ec-tab'){state.tab=el.dataset.tab;state.preview=null;render();return;}
    if(act==='ec-refresh'){state.loaded=false;state.error='';state.preview=null;render();return;}
    if(act==='ec-history'){setPage('emails');return;}
    if(act==='ec-select-all'){state.selected=new Set(recipients().slice(0,20).map(x=>x.email));render();return;}
    if(act==='ec-select-none'){state.selected.clear();render();return;}
    if(act==='ec-preview'){state.tab='preview';state.previewEmail=el.dataset.email||'';state.preview=null;render();return loadPreview();}
    if(act==='ec-load-preview')return loadPreview();
    if(act==='ec-save-settings'){if(!p().canEditSettings)return;const c={enabled:document.getElementById('ec-enabled')?.checked===true,hour:Number(document.getElementById('ec-hour')?.value),daysAhead:Number(document.getElementById('ec-days')?.value),weekdays:[...document.querySelectorAll('[data-ec-opt="weekdays"]:checked')].map(x=>Number(x.value)),scopes:[...document.querySelectorAll('[data-ec-opt="scopes"]:checked')].map(x=>x.value),roles:[...document.querySelectorAll('[data-ec-opt="roles"]:checked')].map(x=>x.value)};
      if(!c.weekdays.length||!c.scopes.length||!c.roles.length)return toast('Thiếu thiết lập','Chọn ít nhất một ngày gửi, loại nhắc và nhóm người nhận.','warning');
      confirmBox('Lưu lịch gửi tự động',`Cập nhật lịch ${c.enabled?'đang bật':'đang tắt'} lúc ${String(c.hour).padStart(2,'0')}:00 (giờ Việt Nam). Hệ thống sẽ tạo hoặc hủy trigger phù hợp.`,async()=>{
        const t=toast('Đang lưu cấu hình','Chỉ chỉnh lịch gửi, không gửi email ngay.','processing',0);try{await gas('saveReminderEmailSettings',c,{timeout:55000});toastUpdate(t,'Đã lưu thiết lập','Lịch gửi đã được cập nhật.','success');state.loaded=false;state.error='';render();}catch(err){toastUpdate(t,'Không lưu được',err.message,'error',8500);}
      });return;
    }
    if(act==='ec-test')return test();
    if(act==='ec-send'){let ids=[...state.selected];if(!ids.length)return;if(ids.length>20)return toast('Giới hạn lượt gửi','Chỉ chọn tối đa 20 người mỗi lượt để tránh quá thời gian Apps Script.','warning');let selected=recipients().filter(r=>ids.includes(r.email));confirmBox('Gửi bản nhắc việc thủ công',`Bạn sắp yêu cầu gửi tới ${selected.length} người nhận (${selected.reduce((s,r)=>s+r.count,0)} mục). Chỉ gửi những người chưa được gửi thành công hoặc chưa rõ kết quả hôm nay. Không thể thu hồi email đã gửi.`,async()=>{
      let t=toast('Đang gửi email','Đang kiểm tra nhật ký và gửi cho người nhận hợp lệ…','processing',0);
      try{let r=await gas('sendReminderEmailsManual',ids,{timeout:115000});toastUpdate(t,'Đã hoàn thành lượt gửi',`Thành công: ${r.sent||0}; bỏ qua: ${r.skipped||0}; cần kiểm tra: ${r.failed||0}. ${(r.errors||[]).slice(0,2).join(' ')}`,r.success?'success':'warning',13000);state.loaded=false;state.error='';render();}catch(err){toastUpdate(t,'Gửi email thất bại',err.message,'error',10000);}
    });return;}
  }
  async function loadPreview(){let rec=recipients().find(x=>x.email===state.previewEmail);if(!rec)return toast('Chưa chọn người nhận','Chọn người nhận trong danh sách.','warning');const t=toast('Đang xem trước','Tổng hợp dữ liệu và dựng bản HTML, không gửi email.','processing',0);
    try{state.preview=await gas('getReminderEmailPreview',rec.email,{timeout:70000});toastUpdate(t,'Đã dựng email','Có '+state.preview.count+' mục nhắc.','success',2000);if(APP.state.page==='emailCenter')render();}
    catch(err){toastUpdate(t,'Không xem trước được',err.message,'error',7000);}
  }
  function test(){confirmBox('Gửi email thử đến tài khoản của tôi','Email thử chỉ gửi đến địa chỉ của nhân sự đang liên kết với tài khoản đăng nhập. Không gửi cho toàn bộ người nhận và không tính là lượt nhắc chính thức.',async()=>{
    const t=toast('Đang gửi thử','Đang gửi email mẫu tới địa chỉ liên kết…','processing',0);
    try{const r=await gas('sendReminderEmailTest',{timeout:70000});toastUpdate(t,'Gửi thử thành công',`Đã gửi đến ${r.email} (${r.count} mục).`,'success',7000);}catch(err){toastUpdate(t,'Gửi thử thất bại',err.message,'error',8000);}
  });}
  document.addEventListener('change',function(ev){const el=ev.target;if(el.matches('[data-ec-check]')){if(el.checked)state.selected.add(el.dataset.ecCheck);else state.selected.delete(el.dataset.ecCheck);document.querySelector('.ec-selected')?.replaceChildren(document.createTextNode(state.selected.size+' đã chọn'));}
    if(el.matches('[data-ec-choice]')){state.previewEmail=el.value;state.preview=null;render();}
  });
  document.addEventListener('input',function(ev){if(ev.target.matches('[data-ec-search]')){state.query=ev.target.value;const el=document.getElementById('ec-items-results');if(el){const arr=visibleItems();el.innerHTML=itemsTable(arr.slice(0,200))+(arr.length>200?'<p class="ec-footnote">Đang hiển thị 200 mục đầu.</p>':'');}}});
  return {render,action,test};
})();
/* V8.8.5: Thư viện & Kỷ yếu - tải theo yêu cầu, không tham gia bootstrap */
window.Gallery=(function(){
 'use strict';
 const state={albums:null,query:'',group:'Tất cả',year:'Tất cả',detail:null,media:[],total:0,offset:0,hasMore:false,busy:false,editable:false,canDelete:false,deleting:false,lightbox:-1,request:0,pendingFiles:[],previewUrls:[],uploading:false,form:null};
 const thumbnail=id=>id&&/^[A-Za-z0-9_-]{10,}$/.test(String(id))?'https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w1200':'';
 const ico=x=>'<span class="material-symbols-rounded">'+x+'</span>';
 const thumbHtml=(id,alt,cls)=>{const src=thumbnail(id);return src?`<img class="${cls||'gallery-photo'}" data-gallery-img="1" data-gallery-file="${att(id)}" loading="lazy" src="${att(src)}" alt="${att(alt||'Ảnh tư liệu')}"><span class="gallery-photo-fallback" hidden>${ico('image_not_supported')}<small>Không xem trước được ảnh</small></span>`:`<span class="gallery-no-image">${ico('photo_library')}<small>Chưa có ảnh bìa</small></span>`;};
 const site=()=>APP.state.page==='gallery';
 const canEdit=()=>state.editable;
 const canDelete=()=>state.canDelete;
 const yearOf=a=>{let y=String(a['Năm bắt đầu']||'').trim();if(!y){const m=String(a['Thời gian hiển thị']||'').match(/(?:19|20)\d{2}/);return m?m[0]:'';}return y;};
 function loading(message){htmlEl('page-content',`<div class="page-shell">${head('Thư viện & Kỷ yếu','Những dấu ấn, sự kiện và tư liệu của Thiền viện.')}<div class="gallery-loading">${ico('hourglass_top')} ${esc(message||'Đang tải thư viện...')}</div></div>`);}
 function show(){if(!site())return;if(state.detail)return renderDetail();if(state.albums)return renderIndex();loading();loadIndex();}
 async function loadIndex(force){if(!site())return;if(!force&&state.albums)return renderIndex();const call=++state.request;loading('Đang đọc danh sách tư liệu từ Google Sheet...');try{
 const res=await gas('galleryGetIndex',{timeout:45000});if(call!==state.request||!site())return;state.albums=res.albums||[];state.editable=!!res.editable;state.canDelete=!!res.canDelete;renderIndex();
 }catch(e){if(call!==state.request||!site())return;htmlEl('page-content',`<div class="page-shell">${head('Thư viện & Kỷ yếu','Không thể tải dữ liệu')}<div class="panel gallery-error">${ico('error_outline')} ${esc(e.message)}<button class="btn" data-action="gallery-refresh">Thử lại</button></div></div>`);}}
 function filtered(){return (state.albums||[]).filter(a=>{const q=norm(state.query),group=state.group,year=state.year;const okText=!q||norm([a['Tên tư liệu'],a['Nhóm tư liệu'],a['Thời gian hiển thị'],a['Địa điểm'],a['Nội dung chi tiết']].join(' ')).includes(q);return okText&&(group==='Tất cả'||a['Nhóm tư liệu']===group)&&(year==='Tất cả'||String(a['Năm bắt đầu'])===year||String(a['Năm kết thúc'])===year||String(a['Thời gian hiển thị']).includes(year));});}
 function card(a){const id=a['Mã tư liệu'],name=a['Tên tư liệu'];return `<button type="button" data-action="gallery-open" data-id="${att(id)}" class="gallery-card">
 <span class="gallery-card-visual">${thumbHtml(a['Ảnh bìa File ID'],name)}<span class="gallery-card-category">${esc(a['Nhóm tư liệu']||'Tư liệu')}</span>${canEdit()&&a['Trạng thái']!=='Đã duyệt'?`<span class="gallery-card-review">${esc(a['Trạng thái']||'Chưa duyệt')}</span>`:''}</span>
 <span class="gallery-card-caption"><strong>${esc(name)}</strong><span>${ico('calendar_month')}${esc(a['Thời gian hiển thị']||yearOf(a)||'Chưa xác định thời gian')}${a['Địa điểm']?` <b>·</b> ${esc(a['Địa điểm'])}`:''}</span></span></button>`;}
 function renderCards(){const rows=filtered(),target=document.getElementById('gallery-results');if(!target)return;
 target.innerHTML=rows.length?`<div class="gallery-card-grid">${rows.map(card).join('')}</div>`:empty('Chưa có tư liệu phù hợp','Hãy đổi năm, danh mục hoặc từ khóa tìm kiếm.');setText('gallery-count',rows.length+' bộ sưu tập');}
 function renderIndex(){if(!site())return;const arr=state.albums||[],groups=['Tất cả',...new Set(arr.map(x=>x['Nhóm tư liệu']).filter(Boolean))],years=['Tất cả',...new Set(arr.flatMap(x=>[String(x['Năm bắt đầu']||''),String(x['Năm kết thúc']||'')]).filter(x=>/^\d{4}$/.test(x)))].sort((a,b)=>a==='Tất cả'?-1:b==='Tất cả'?1:Number(b)-Number(a));
 let actions=canEdit()?`<button class="btn btn-primary" data-action="gallery-edit">${ico('add')} Thêm tư liệu</button>`:'';
 htmlEl('page-content',`<div class="page-shell gallery-page">${head('Thư viện & Kỷ yếu','Hình ảnh là trung tâm · chạm vào bộ sưu tập để xem toàn bộ.',actions)}
 <div class="gallery-hero"><div class="gallery-hero-icon">${ico('temple_buddhist')}</div><div><span class="gallery-eyebrow">KHO TƯ LIỆU THIỀN VIỆN</span><h2>Hành trình lưu giữ dấu ấn</h2><p>Lịch sử hình thành, kỷ yếu võ thuật, hoạt động thiện nguyện và hình ảnh theo năm.</p></div><button class="btn" data-action="gallery-refresh">${ico('refresh')} Cập nhật danh sách</button></div>
 <div class="panel gallery-controls"><label class="search-box gallery-search">${ico('search')}<input id="gallery-search" type="search" value="${att(state.query)}" placeholder="Tìm tên, thời gian, địa điểm..."></label>
 <div class="gallery-filter-right"><div class="gallery-selects"><label>Danh mục<select id="gallery-group">${groups.map(g=>`<option value="${att(g)}" ${g===state.group?'selected':''}>${esc(g)}</option>`).join('')}</select></label>
 <label>Năm<select id="gallery-year">${years.map(y=>`<option value="${att(y)}" ${y===state.year?'selected':''}>${esc(y)}</option>`).join('')}</select></label></div><small id="gallery-count"></small></div></div>
 <div id="gallery-results"></div></div>`);renderCards();}
 async function open(id){if(!site())return;const album=(state.albums||[]).find(x=>x['Mã tư liệu']===id);if(!album){toast('Không tìm thấy tư liệu',id,'warning');return;}
 state.detail={...album};state.media=[];state.total=0;state.offset=0;state.hasMore=false;state.lightbox=-1;renderDetail();await loadMedia(true);}
 async function loadMedia(reset){if(!state.detail||state.busy)return;const id=state.detail['Mã tư liệu'],call=++state.request,offset=reset?0:state.media.length;state.busy=true;
 const btn=document.querySelector('[data-action="gallery-more"]');if(btn)btn.disabled=true;
 try{const res=await gas('galleryGetMedia',id,offset,24,{timeout:60000});if(call!==state.request||!state.detail||state.detail['Mã tư liệu']!==id)return;
 state.detail=res.album;state.editable=!!res.editable;state.canDelete=!!res.canDelete;state.media=reset?res.items:state.media.concat(res.items);state.total=res.total;state.hasMore=res.more;renderDetail();
 }catch(e){toast('Không tải được danh sách file',e.message,'error',6500);}finally{state.busy=false;}}
 const mediaPhotos=()=>state.media.filter(m=>m['Loại media']==='Ảnh');
 function mediaTile(m){const image=m['Loại media']==='Ảnh';const src=thumbnail(m['File ID']);return `<div class="gallery-media-tile"><button type="button" data-action="gallery-open-media" data-id="${att(m['Mã media'])}" class="gallery-media-image" title="${att(m['Tên file'])}">
 ${image?thumbHtml(m['File ID'],m['Tên file']):`<span class="gallery-media-other">${ico(m['Loại media']==='Video'?'movie':'picture_as_pdf')}<small>${esc(m['Loại media'])}</small></span>`}</button>
 <div class="gallery-media-name"><span title="${att(m['Tên file'])}">${esc(m['Chú thích']||m['Tên file']||'Ảnh')}</span></div>
 ${canEdit()?`<div class="gallery-media-admin"><button class="btn btn-sm" data-action="gallery-set-cover" data-id="${att(m['Mã media'])}" title="Chọn làm ảnh bìa" ${!image?'disabled':''}>${ico('wallpaper')}</button><button class="btn btn-sm" data-action="gallery-edit-caption" data-id="${att(m['Mã media'])}" title="Sửa chú thích">${ico('edit_note')}</button><button class="btn btn-sm btn-danger" data-action="gallery-hide-media" data-id="${att(m['Mã media'])}" title="Ẩn khỏi album">${ico('visibility_off')}</button></div>`:''}</div>`;}
 function renderDetail(){if(!site()||!state.detail)return;const a=state.detail,name=a['Tên tư liệu'],id=a['Mã tư liệu'],cover=a['Ảnh bìa File ID'];
 let controls=canEdit()?`<button class="btn" data-action="gallery-edit" data-id="${att(id)}">${ico('edit')} Chỉnh sửa bài</button><button class="btn btn-primary" data-action="gallery-upload">${ico('cloud_upload')} Thêm ảnh/file</button>${a['Folder ID nguồn']?`<button class="btn" data-action="gallery-sync">${ico('sync')} Đồng bộ Drive</button>`:''}`:'';
 if(canDelete())controls+=`<button type="button" class="btn btn-danger gallery-delete-action" data-action="gallery-delete" data-id="${att(id)}" aria-label="Xóa bộ sưu tập ${att(name)}">${ico('delete_outline')} Xóa bộ sưu tập</button>`;
 htmlEl('page-content',`<div class="page-shell gallery-page gallery-detail"><div class="gallery-backrow"><button class="btn" data-action="gallery-back">${ico('arrow_back')} Quay lại thư viện</button><small>${esc(a['Nhóm tư liệu']||'Tư liệu')} · ${esc(id)}</small></div>
 <div class="gallery-detail-hero"><div class="gallery-detail-visual">${thumbHtml(cover,name,'gallery-photo')}<span class="gallery-cover-label">Ảnh bìa</span></div>
 <div class="gallery-detail-info"><span class="gallery-eyebrow">${esc(a['Nhóm tư liệu']||'Tư liệu')}</span><h1>${esc(name)}</h1><div class="gallery-detail-meta"><span>${ico('calendar_month')}${esc(a['Thời gian hiển thị']||yearOf(a)||'Chưa rõ thời gian')}</span>${a['Địa điểm']?`<span>${ico('location_on')}${esc(a['Địa điểm'])}</span>`:''}</div>
 <div class="gallery-detail-story"><p id="gallery-story" class="${String(a['Nội dung chi tiết']||'').length>360?'gallery-story-collapsed':''}">${esc(a['Nội dung chi tiết']||'Chưa có nội dung chi tiết.')}</p>${String(a['Nội dung chi tiết']||'').length>360?`<button class="gallery-more-text" data-action="gallery-story-expand">Xem nội dung đầy đủ ${ico('expand_more')}</button>`:''}</div>
 <div class="gallery-actions">${controls}${a['Link thư mục nguồn']?`<a class="btn" href="${att(a['Link thư mục nguồn'])}" target="_blank" rel="noopener noreferrer">${ico('folder_open')} Thư mục Drive gốc</a>`:''}</div></div></div>
 <div class="gallery-section-heading"><div><h2>${ico('photo_library')} Ảnh và tư liệu</h2><p>Đã tải ${state.media.length} / ${state.total} file · Chạm ảnh để xem lớn.</p></div></div>
 ${state.media.length?`<div class="gallery-media-grid">${state.media.map(mediaTile).join('')}</div>`:state.busy?`<div class="gallery-loading">Đang tải ảnh...</div>`:empty('Album chưa có ảnh hoặc tài liệu','Chọn “Đồng bộ Drive” hoặc tải ảnh mới lên album.')}
 ${state.hasMore?`<div class="gallery-load-more"><button class="btn" data-action="gallery-more">${ico('expand_more')} Xem thêm ảnh</button></div>`:''}
 <input type="file" id="gallery-upload-input" accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,application/pdf,video/mp4,video/webm" multiple hidden></div>`);
 }

/* ===== Thư viện V8.8.6: biểu mẫu 3 bước + quản lý media ===== */
function defaultGalleryDraft(a){return {id:a['Mã tư liệu']||'',name:a['Tên tư liệu']||'',group:a['Nhóm tư liệu']||'Lịch sử Thiền viện',status:a['Trạng thái']||'Nháp',startYear:a['Năm bắt đầu']||'',endYear:a['Năm kết thúc']||'',period:a['Thời gian hiển thị']||'',place:a['Địa điểm']||'',folder:a['Link thư mục nguồn']||a['Folder ID nguồn']||'',description:a['Nội dung chi tiết']||'',source:a['Nguồn tài liệu']||'',note:a['Ghi chú']||''};}
function mediaFormImg(m){return m.file?m.url:(m['Loại media']==='Ảnh'?thumbnail(m['File ID']):'');}
function mediaFormIsImage(m){return m.file?m.file.type.startsWith('image/'):m['Loại media']==='Ảnh';}
function releaseFormFiles(){const f=state.form;if(!f)return;(f.files||[]).forEach(x=>{try{if(x.url)URL.revokeObjectURL(x.url);}catch(e){}});}
function setGalleryFormDirty(){APP.state.galleryDirty=true;if(state.form)state.form.dirty=true;}
function formValues(){const f=state.form;if(!f)return;
 const keys=['name','status','start','end','period','place','description'];const maps={start:'startYear',end:'endYear'};
 keys.forEach(k=>{const el=document.getElementById('gal-'+k);if(el)f.draft[maps[k]||k]=el.value;});
 const group=document.getElementById('gal-group');if(group){f.draft.group=group.value==='__other__'?(document.getElementById('gal-group-custom')?.value||'').trim():group.value;}
}
function formField(id,label,value='',type='text',extra=''){return `<label class="gallery-wizard-field"><span>${esc(label)}</span><input id="gal-${id}" type="${type}" value="${att(value)}" ${extra}></label>`;}
function formMediaCount(f){return f.existing.filter(x=>!x.hidden).length+f.files.length;}
function galleryWizardTabs(f){return `<nav class="gallery-wizard-tabs" aria-label="Các bước tạo bộ sưu tập">${['Thông tin','Hình ảnh','Kiểm tra & lưu'].map((name,i)=>`<button type="button" data-action="gallery-wizard-jump" data-step="${i+1}" class="gallery-wizard-tab ${i+1===f.step?'active':''} ${i+1<f.step?'done':''}" ${i+1===f.step?'aria-current="step"':''} ${f.saving?'disabled':''}><b>${i+1}</b><span>${name}</span></button>`).join('')}</nav>`;}
function galleryWizardInfo(f){const d=f.draft;return `<div class="gallery-wizard-grid">
 <div class="gallery-wizard-wide">${formField('name','Tên bộ sưu tập *',d.name,'text','maxlength="240" placeholder="Nhập tên tư liệu..."')}</div>
 <label class="gallery-wizard-field"><span>Nhóm tư liệu *</span><select id="gal-group" aria-label="Chọn nhóm tư liệu">${[...new Set(['Lịch sử Thiền viện','Kỷ yếu võ thuật','Thiện nguyện & xã hội','Bằng khen & tư liệu','Lưu trữ theo năm',...(state.albums||[]).map(a=>a['Nhóm tư liệu']).filter(Boolean),d.group].filter(Boolean))].map(v=>`<option value="${att(v)}" ${d.group===v?'selected':''}>${esc(v)}</option>`).join('')}<option value="__other__">+ Nhập nhóm mới...</option></select><input id="gal-group-custom" class="gallery-group-custom" maxlength="120" placeholder="Nhập tên nhóm mới" hidden></label>
 <label class="gallery-wizard-field"><span>Trạng thái</span><select id="gal-status">${['Nháp','Đã duyệt','Ẩn'].map(x=>`<option ${d.status===x?'selected':''}>${x}</option>`).join('')}</select></label>
 ${formField('start','Năm bắt đầu',d.startYear,'number','min="1000" max="2100" placeholder="VD: 2025"')}
 ${formField('end','Năm kết thúc',d.endYear,'number','min="1000" max="2100" placeholder="VD: 2026"')}
 ${formField('period','Thời gian hiển thị',d.period,'text','maxlength="120" placeholder="VD: Trung thu 2026"')}
 ${formField('place','Địa điểm',d.place,'text','maxlength="240"')}
 <label class="gallery-wizard-field gallery-wizard-wide"><span>Nội dung giới thiệu bộ sưu tập</span><textarea id="gal-description" rows="5" maxlength="15000" placeholder="Câu chuyện, hoạt động và ý nghĩa của bộ sưu tập...">${esc(d.description)}</textarea></label>
</div>`;}
function galleryFormTile(m,index,f){const isNew=!!m.file,photo=mediaFormIsImage(m),src=mediaFormImg(m),caption=m.caption||'',label=isNew?m.file.name:m['Tên file'],size=isNew?(m.file.size/1048576).toFixed(2)+' MB':String(m['Dung lượng KB']?m['Dung lượng KB']+' KB':'');
const cover=(f.cover?.key===(isNew?m.key:m['Mã media']));
return `<div class="gallery-wizard-tile ${m.hidden?'marked-hidden':''}" data-gallery-media-key="${att(isNew?m.key:m['Mã media'])}">
<div class="gallery-wizard-thumb">${src?`<img src="${att(src)}" alt="${att(label)}" loading="lazy">`:ico(photo?'image':'description')}<div class="gallery-wizard-tile-count">${index+1}</div></div>
<div class="gallery-wizard-item-text"><strong title="${att(label)}">${esc(label)}</strong><small>${isNew?'Chưa upload':('Đã lưu · '+(size||'Drive'))}</small>
<input data-gallery-caption="${att(isNew?m.key:m['Mã media'])}" placeholder="Chú thích riêng (nếu có)" maxlength="500" value="${att(caption)}"></div>
<div class="gallery-wizard-item-actions"><label class="gallery-cover-pick ${cover?'selected':''}" title="Đặt làm ảnh bìa"><input type="radio" name="gallery-wizard-cover" data-gallery-cover="${att(isNew?m.key:m['Mã media'])}" ${cover?'checked':''} ${photo&&!m.hidden?'':'disabled'}> ${ico('wallpaper')} <span>Ảnh bìa</span></label>
<button type="button" data-action="gallery-wizard-move" data-key="${att(isNew?m.key:m['Mã media'])}" data-direction="-1" title="Lên trên" ${index===0?'disabled':''}>${ico('arrow_upward')}</button>
<button type="button" data-action="gallery-wizard-move" data-key="${att(isNew?m.key:m['Mã media'])}" data-direction="1" title="Xuống dưới">${ico('arrow_downward')}</button>
<button type="button" class="gallery-wizard-remove" data-action="gallery-wizard-remove" data-key="${att(isNew?m.key:m['Mã media'])}" title="${isNew?'Bỏ file đã chọn':'Ẩn ảnh khỏi album'}">${ico(isNew?'close':'visibility_off')}</button></div></div>`;
}
function galleryWizardMedia(f){const all=[...f.existing.filter(x=>!x.hidden),...f.files];const show=f.displayOrder?f.displayOrder.map(key=>all.find(x=>(x.key||x['Mã media'])===key)).filter(Boolean).concat(all.filter(x=>!f.displayOrder.includes(x.key||x['Mã media']))):all;return `<div class="gallery-wizard-media"><div class="gallery-wizard-media-head"><div><h3>Ảnh bìa & ảnh trong bộ sưu tập</h3><p>Ảnh bìa được chọn từ các ảnh bên dưới, không cần upload hai lần.</p></div><strong>${formMediaCount(f)} file</strong></div>
<div class="gallery-wizard-upload"><div class="gallery-upload-intro"><span class="gallery-wizard-symbol small">📷</span><div class="gallery-upload-copy"><strong>Thêm ảnh và tài liệu</strong><small>JPG, PNG, WebP, GIF, HEIC, PDF, MP4/WebM · tối đa 12 MB/file · 12 file mỗi lượt lưu</small></div></div><label class="btn btn-primary" for="gal-form-files">Chọn file</label><input id="gal-form-files" type="file" multiple hidden accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,application/pdf,video/mp4,video/webm"></div>
${show.length?`<div class="gallery-wizard-item-list">${show.map((m,i)=>galleryFormTile(m,i,f)).join('')}</div>`:`<div class="gallery-wizard-empty">${ico('photo_library')}<span>Chưa chọn ảnh nào. Bạn có thể thêm ảnh ở bước này hoặc bổ sung sau khi lưu.</span></div>`}
${f.old?.['Ảnh bìa File ID']&&!f.cover?.key?`<p class="gallery-wizard-hint">Ảnh bìa cũ vẫn được giữ nguyên nếu bạn chưa chọn ảnh khác.</p>`:''}
${f.more?`<button class="btn" type="button" data-action="gallery-wizard-more" ${f.loading?'disabled':''}>${ico('expand_more')} ${f.loading?'Đang tải ảnh...':'Tải thêm ảnh đã lưu ('+f.existing.length+' / '+f.total+')'}</button>`:''}
${f.existing.some(x=>x.hidden)?`<small class="gallery-wizard-hint">${f.existing.filter(x=>x.hidden).length} ảnh đã đánh dấu ẩn; file gốc vẫn được giữ trên Drive.</small>`:''}</div>`;}
function galleryWizardReview(f){const d=f.draft,active=f.existing.filter(x=>!x.hidden).length,added=f.files.length;const cover=[...f.existing,...f.files].find(x=>(x.key||x['Mã media'])===f.cover?.key);
return `<div class="gallery-wizard-review"><div class="gallery-wizard-review-hero"><span class="gallery-wizard-symbol">🖼️</span><div><h3>${esc(d.name||'Chưa có tên bộ sưu tập')}</h3><p>${esc(d.group||'Chưa chọn nhóm')} · ${esc(d.period||d.startYear||'Chưa nhập thời gian')} · ${esc(d.status)}</p></div></div>
<div class="gallery-wizard-review-stats"><div><small>Ảnh/tài liệu đã có (đang giữ)</small><strong>${active}</strong></div><div><small>File sẽ upload</small><strong>${added}</strong></div><div><small>Ảnh bìa đã chọn</small><strong>${cover?esc(cover.file?.name||cover['Tên file']):'Giữ ảnh cũ / tự chọn'}</strong></div></div>
<p class="gallery-wizard-hint">Bấm Lưu sẽ ghi thông tin bộ sưu tập, lần lượt upload file lên Drive, sau đó cập nhật thứ tự, chú thích, ảnh bìa và 3 trường metadata mới. Nếu file lỗi, album đã lưu vẫn được giữ.</p></div>`;}
function galleryWizardRender(){const f=state.form;if(!f)return;
const body=`${galleryWizardTabs(f)}<div class="gallery-wizard-step">${f.step===1?galleryWizardInfo(f):f.step===2?galleryWizardMedia(f):galleryWizardReview(f)}</div>`;
const footer=`<button type="button" class="btn" data-action="gallery-wizard-cancel">Hủy</button>${f.step>1?`<button type="button" class="btn" data-action="gallery-wizard-back">← Quay lại</button>`:''}${f.step<3?`<button type="button" class="btn btn-primary" data-action="gallery-wizard-next">Tiếp tục →</button>`:`<button type="button" class="btn btn-primary" data-action="gallery-save">Lưu bộ sưu tập</button>`}`;
 modal(f.old?'Chỉnh sửa bộ sưu tập':'Thêm bộ sưu tập mới',`Bước ${f.step}/3 · ${f.old?'Mã '+f.old['Mã tư liệu']:'Mã tự sinh khi lưu'}`,body,footer,'wide');
 const element=document.querySelector('#modal-root .modal');element?.classList.add('gallery-wizard-modal');
 const scroll=element?.querySelector('.modal-body');if(scroll)scroll.scrollTop=0;
 }
function albumForm(existing){if(!canEdit())return;releaseFormFiles();const a=existing||{};state.form={old:existing||null,step:1,draft:defaultGalleryDraft(a),existing:[],total:0,more:false,loading:false,files:[],cover:{key:''},dirty:false,saving:false};
APP.state.galleryDirty=false;galleryWizardRender();if(existing)loadWizardExisting();}
async function loadWizardExisting(){const f=state.form;if(!f||!f.old||f.loading||!canEdit())return;const albumId=f.old['Mã tư liệu'];f.loading=true;try{const r=await gas('galleryGetMedia',albumId,f.existing.length,42,{timeout:60000});if(state.form!==f)return;
const oldCover=f.old['Ảnh bìa File ID'];r.items.forEach(m=>{m.caption=String(m['Chú thích']||'');m.hidden=false;f.existing.push(m);if(oldCover===m['File ID']&&!f.cover.key)f.cover.key=m['Mã media'];});f.total=r.total;f.more=r.more;
if(f.step===2)galleryWizardRender();}catch(e){toast('Không tải được ảnh đã lưu',e.message,'error',7000);}finally{f.loading=false;}}
function galleryWizardJump(step){const f=state.form;if(!f||f.saving)return;
 const next=Number(step);if(!Number.isInteger(next)||next<1||next>3||next===f.step)return;
 if(f.step===1)formValues();f.step=next;galleryWizardRender();
 }
 function galleryWizardNext(){const f=state.form;if(!f)return;galleryWizardJump(Math.min(3,f.step+1));}
 function galleryWizardBack(){const f=state.form;if(!f)return;galleryWizardJump(Math.max(1,f.step-1));}
function galleryWizardFiles(files){const f=state.form;if(!f||f.saving)return;const max=12*1024*1024,allow=/^(image\/(jpeg|png|webp|gif|heic|heif)|application\/pdf|video\/(mp4|webm))$/;
let valid=files.filter(file=>file.size>0&&file.size<=max&&allow.test(file.type));if(valid.length!==files.length)toast('Một số file không hợp lệ','Chỉ hỗ trợ ảnh, PDF, video ngắn và mỗi file tối đa 12 MB.','warning');
const slots=Math.max(0,12-f.files.length);if(valid.length>slots)toast('Giới hạn lượt upload','Tối đa 12 file mới mỗi lượt lưu. Sau đó có thể sửa album để thêm tiếp.','warning');
valid.slice(0,slots).forEach(file=>{const url=file.type.startsWith('image/')?URL.createObjectURL(file):'';f.files.push({file,url,key:'new-'+Date.now()+'-'+Math.random().toString(36).slice(2),caption:''});});
if(valid.length) setGalleryFormDirty();galleryWizardRender();}
function galleryWizardMove(key,delta){const f=state.form;if(!f||f.saving)return;const all=[...f.existing.filter(m=>!m.hidden),...f.files],active=f.displayOrder?f.displayOrder.map(k=>all.find(x=>(x.key||x['Mã media'])===k)).filter(Boolean).concat(all.filter(x=>!f.displayOrder.includes(x.key||x['Mã media']))):all,p=active.findIndex(x=>(x.key||x['Mã media'])===key),q=p+delta;if(p<0||q<0||q>=active.length)return;
[active[p],active[q]]=[active[q],active[p]];f.existing=active.filter(x=>!x.file).concat(f.existing.filter(x=>x.hidden));f.files=active.filter(x=>x.file); // cross-group reorder uses stable display rank below
f.displayOrder=active.map(x=>x.key||x['Mã media']);setGalleryFormDirty();galleryWizardRender();}
function galleryWizardRemove(key){const f=state.form;if(!f||f.saving)return;const n=f.files.findIndex(x=>x.key===key);if(n>=0){const [removed]=f.files.splice(n,1);if(removed.url)URL.revokeObjectURL(removed.url);}else{const m=f.existing.find(x=>x['Mã media']===key);if(m)m.hidden=true;}
if(f.cover.key===key)f.cover.key='';if(f.displayOrder)f.displayOrder=f.displayOrder.filter(x=>x!==key);setGalleryFormDirty();galleryWizardRender();}
function galleryWizardCancel(){const f=state.form;if(f?.saving)return;requestDiscardDraft(()=>{releaseFormFiles();state.form=null;closeModal();});}
function fileAsBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||'').split(',')[1]||'');reader.onerror=()=>reject(Error('Không đọc được file'));reader.readAsDataURL(file);});}
async function saveAlbum(){const f=state.form;if(!f||f.saving)return;const d=f.draft;
 if(!String(d.name||'').trim()||!String(d.group||'').trim()){galleryWizardJump(1);return toast('Thiếu thông tin','Bộ sưu tập cần có tên và nhóm tư liệu.','warning');}
 const y=String(d.startYear||''),e=String(d.endYear||'');
 if((y&&!/^\d{4}$/.test(y))||(e&&!/^\d{4}$/.test(e))||(y&&e&&+e<+y)){galleryWizardJump(1);return toast('Năm chưa hợp lệ','Nhập năm gồm 4 chữ số; năm kết thúc không được nhỏ hơn năm bắt đầu.','warning');}
f.saving=true;state.uploading=true;const btn=document.querySelector('[data-action="gallery-save"]');if(btn)btn.disabled=true;
const t=toast('Đang lưu bộ sưu tập','Đang ghi thông tin vào Google Sheet...','processing',0);let savedId='',success=[],failed=[];
try{
const res=await gas('gallerySaveAlbum',d,{timeout:60000});savedId=res.album['Mã tư liệu'];
const order=f.displayOrder||[...f.existing.filter(m=>!m.hidden),...f.files].map(x=>x.key||x['Mã media']);
for(let i=0;i<f.files.length;i++){const item=f.files[i];toastUpdate(t,'Đang upload ảnh',`${i+1}/${f.files.length}: ${item.file.name}`,'processing',0);
try{const data=await fileAsBase64(item.file);const r=await gas('galleryUploadMedia',{albumId:savedId,name:item.file.name,mime:item.file.type,data},{timeout:95000});success.push({id:r.media['Mã media'],key:item.key,caption:item.caption,media:r.media});}catch(err){failed.push({key:item.key,file:item.file.name,error:err.message});}}
const ids=Object.fromEntries(success.map(x=>[x.key,x.id]));const visibleOld=f.existing.filter(x=>!x.hidden);const edits=[...f.existing.map(x=>({id:x['Mã media'],caption:x.caption||'',hidden:x.hidden===true})),...success.map(x=>({id:x.id,caption:x.caption||'',hidden:false}))];
const fullOrder=order.map(x=>ids[x]||x).filter(x=>f.existing.some(e=>e['Mã media']===x&&!e.hidden)||success.some(e=>e.id===x));
const coverMediaId=ids[f.cover.key]||((f.existing.find(x=>x['Mã media']===f.cover.key&&!x.hidden))?f.cover.key:'');
const patch=await gas('gallerySaveMediaLayout',{albumId:savedId,items:edits,order:fullOrder,coverMediaId},{timeout:90000});
state.albums=(state.albums||[]).filter(x=>x['Mã tư liệu']!==savedId);state.albums.unshift(patch.album);if(state.detail?.['Mã tư liệu']===savedId)state.detail=patch.album;
if(failed.length){
 // Keep the modal with the failed files only; uploaded ones are already persisted.
 const failedKeys=new Set(failed.map(x=>x.key));f.files=f.files.filter(x=>failedKeys.has(x.key));f.files.forEach(x=>{x.key='new-'+Date.now()+'-'+Math.random().toString(36).slice(2);});
 f.draft.id=savedId;f.old=patch.album;f.existing=[];f.total=0;f.more=false;f.displayOrder=null;f.step=2;f.cover={key:''};f.dirty=true;APP.state.galleryDirty=true;
 toastUpdate(t,'Đã lưu album, còn file lỗi',`${success.length} file thành công, ${failed.length} file chưa tải: ${failed.slice(0,2).map(x=>x.file).join(', ')}`,'warning',12000);
 galleryWizardRender();loadWizardExisting();return;
}
releaseFormFiles();state.form=null;APP.state.galleryDirty=false;closeModal();
if(state.detail&&state.detail['Mã tư liệu']===savedId){state.media=[];state.busy=false;await loadMedia(true);}else renderIndex();
toastUpdate(t,'Đã lưu bộ sưu tập',`${success.length} file mới · ${visibleOld.length} file giữ nguyên`, 'success',6000);
}catch(err){
toastUpdate(t,savedId?'Album đã tạo nhưng chưa hoàn tất':'Không thể lưu',err.message,'error',11000);
if(savedId){f.draft.id=savedId;f.old={...f.old,...d,'Mã tư liệu':savedId};
 if(success.length){const map=Object.fromEntries(success.map(x=>[x.key,x.id]));const keys=new Set(success.map(x=>x.key));
  f.files=f.files.filter(x=>{if(!keys.has(x.key))return true;if(x.url)URL.revokeObjectURL(x.url);return false;});
  f.existing.push(...success.map(x=>({...x.media,caption:x.caption,hidden:false})));
  f.displayOrder=(f.displayOrder||[]).map(k=>map[k]||k);
  if(map[f.cover.key])f.cover.key=map[f.cover.key];
 }
 f.step=2;f.dirty=true;APP.state.galleryDirty=true;galleryWizardRender();}
}finally{f.saving=false;state.uploading=false;const b=document.querySelector('[data-action="gallery-save"]');if(b)b.disabled=false;}
}
 function clearPending(){state.previewUrls.forEach(u=>{try{URL.revokeObjectURL(u);}catch(e){}});state.previewUrls=[];state.pendingFiles=[];}
 function onFiles(files){const a=state.detail;if(!a||!canEdit())return;clearPending();const valid=files.filter(f=>f.size<=12*1024*1024&&/^(image\/(jpeg|png|webp|gif|heic|heif)|application\/pdf|video\/(mp4|webm))$/.test(f.type));
 if(files.length!==valid.length)toast('Một số file chưa phù hợp','Mỗi file tối đa 12 MB; hỗ trợ ảnh, PDF và video MP4/WebM nhỏ.','warning',7000);
 if(!valid.length)return;state.pendingFiles=valid.slice(0,12);if(valid.length>12)toast('Giới hạn mỗi lượt','Tối đa 12 file/lượt. Hãy chọn tiếp phần còn lại sau khi lưu.','warning');
 const tiles=state.pendingFiles.map((f,i)=>{let preview='';if(f.type.startsWith('image/')){try{let url=URL.createObjectURL(f);state.previewUrls.push(url);preview=`<img src="${att(url)}" alt="${att(f.name)}">`;}catch(e){}}
 return `<div class="gallery-pending-row"><div class="gallery-pending-thumbnail">${preview||ico(f.type.startsWith('video/')?'movie':'description')}</div><div><strong>${esc(f.name)}</strong><small>${(f.size/(1024*1024)).toFixed(2)} MB · ${esc(f.type)}</small></div></div>`;}).join('');
 modal('Xem trước ảnh & tài liệu',`Thư viện tư liệu · ${a['Tên tư liệu']} · ${a['Mã tư liệu']}`,`<div class="gallery-pending-list">${tiles}</div><p class="field-help">Chỉ bấm xác nhận nếu đúng album đích. File được lưu trên Google Drive do Web App quản lý.</p>`,
 `<button class="btn" data-action="gallery-cancel-upload">Hủy</button><button class="btn btn-primary" data-action="gallery-confirm-upload">${ico('cloud_upload')} Tải lên ${state.pendingFiles.length} file</button>`,'wide');
 const input=document.getElementById('gallery-upload-input');if(input)input.value='';}
 async function uploadFiles(){const valid=state.pendingFiles.slice();const a=state.detail;if(!a||!valid.length)return;const btn=document.querySelector('[data-action="gallery-confirm-upload"]');if(btn)btn.disabled=true;
 const id=a['Mã tư liệu'];let ok=0,failed=[];state.uploading=true;
 for(const file of valid){
 if(btn)btn.textContent='Đang tải '+(ok+failed.length+1)+' / '+valid.length+' file...';
 try{const data=await new Promise((resolve,reject)=>{const rd=new FileReader();rd.onload=()=>resolve(String(rd.result||'').split(',')[1]||'');rd.onerror=()=>reject(Error('Không đọc được file'));rd.readAsDataURL(file);});
 await gas('galleryUploadMedia',{albumId:id,name:file.name,mime:file.type,data:data},{timeout:95000});ok++;
 }catch(e){failed.push(file.name+': '+e.message);}
 }
 state.uploading=false;clearPending();closeModal();if(site()&&state.detail?.['Mã tư liệu']===id){state.media=[];state.busy=false;await loadMedia(true);await reloadIndexSilently();}
 if(ok)toast('Đã tải '+ok+' file','Các file được liên kết với đúng album '+id+'.');if(failed.length)toast('Có file tải lên lỗi',failed.slice(0,3).join('; '),'warning',9500);
 }
 async function reloadIndexSilently(){try{const r=await gas('galleryGetIndex',{timeout:30000});state.albums=r.albums;state.editable=!!r.editable;state.canDelete=!!r.canDelete;}catch(e){console.warn('Không cập nhật được ảnh bìa:',e);}}
 async function sync(){if(!state.detail)return;const id=state.detail['Mã tư liệu'];const btn=document.querySelector('[data-action="gallery-sync"]');if(btn)btn.disabled=true;
 try{const r=await gas('gallerySyncAlbum',id,{timeout:90000});toast('Đã đồng bộ thư mục nguồn',r.added+' file mới được liên kết.'+(r.hasMore?' Thư mục còn file, bấm đồng bộ thêm.':''));state.media=[];state.busy=false;await loadMedia(true);await reloadIndexSilently();}
 catch(e){toast('Đồng bộ không thành công',e.message,'error',7000);}finally{if(btn)btn.disabled=false;}}
 async function setCover(mediaId){const id=state.detail?.['Mã tư liệu'];if(!id)return;try{const r=await gas('gallerySetCover',id,mediaId,{timeout:50000});state.detail=r.album;renderDetail();await reloadIndexSilently();toast('Đã thay ảnh bìa','Ảnh bìa của album đã được cập nhật.');}catch(e){toast('Không thể đặt ảnh bìa',e.message,'error');}}
 async function hideMedia(mediaId){const album=state.detail?.['Mã tư liệu'];if(!album)return;confirmBox('Ẩn file khỏi album','Tài liệu sẽ không còn xuất hiện trong album. File gốc trên Drive không bị xóa.',async()=>{
 try{await gas('galleryHideMedia',album,mediaId,{timeout:50000});state.media=[];state.busy=false;await loadMedia(true);await reloadIndexSilently();toast('Đã ẩn file','Không xóa file gốc khỏi Drive.');}catch(e){toast('Không thể ẩn file',e.message,'error');}});}
 async function deleteAlbum(){
  const album=state.detail;
  if(!album||!canDelete()||state.deleting)return;
  if(state.uploading||state.form?.saving){toast('Không thể xóa lúc này','Hãy hoàn tất tải file hoặc lưu trước khi xóa.','warning');return;}
  const albumId=String(album['Mã tư liệu']),name=String(album['Tên tư liệu']||albumId);
  confirmBox('Xóa bộ sưu tập?',
   'Bạn sắp xóa bộ sưu tập “'+name+'” ('+albumId+') khỏi thư viện. Các ảnh, tài liệu và bản ghi trong Google Sheet vẫn được giữ để có thể khôi phục. Tiếp tục?',
   async()=>{
    if(state.deleting||!state.detail||String(state.detail['Mã tư liệu'])!==albumId)return;
    state.deleting=true;
    const notice=toast('Đang xóa bộ sưu tập','Cập nhật trạng thái trên Google Sheet...','processing',0);
    try{
     const result=await gas('galleryDeleteAlbum',albumId,{timeout:60000});
     state.request++;state.albums=(state.albums||[]).filter(x=>String(x['Mã tư liệu'])!==albumId);
     state.detail=null;state.media=[];state.total=0;state.offset=0;state.hasMore=false;
     closeImage();renderIndex();
     toastUpdate(notice,'Đã xóa bộ sưu tập',name+' · '+(result.mediaCount||0)+' file vẫn được giữ trên Drive và Database.','success',6500);
    }catch(e){toastUpdate(notice,'Xóa không thành công',e.message,'error',7500);}
    finally{state.deleting=false;}
   });
 }
 function captionForm(id){const m=state.media.find(x=>x['Mã media']===id);if(!m)return;modal('Chú thích ảnh / tài liệu',m['Tên file'],`<div class="form-field"><label>Chú thích</label><textarea id="gallery-note" rows="3" maxlength="500">${esc(m['Chú thích']||'')}</textarea></div>`,`<button class="btn" data-action="close-modal">Hủy</button><button class="btn btn-primary" data-action="gallery-save-caption" data-id="${att(id)}">Lưu chú thích</button>`,'small');}
 async function saveCaption(id){const note=document.getElementById('gallery-note')?.value||'';const album=state.detail?.['Mã tư liệu'];try{const r=await gas('gallerySaveMediaNote',album,id,note,{timeout:50000});const old=state.media.find(x=>x['Mã media']===id);if(old)old['Chú thích']=r.media['Chú thích'];closeModal();renderDetail();toast('Đã lưu chú thích','Cập nhật thành công.');}catch(e){toast('Không thể lưu chú thích',e.message,'error');}}
 function openMedia(id){const m=state.media.find(x=>x['Mã media']===id);if(!m)return;if(m['Loại media']!=='Ảnh'){
 const url=m['Link xem'];if(/^https:\/\//.test(url))window.open(url,'_blank','noopener,noreferrer');else toast('Không thể mở file','Link Drive không hợp lệ.','warning');return;}
 const photos=mediaPhotos();state.lightbox=photos.findIndex(x=>x['Mã media']===id);drawLightbox();}
 function drawLightbox(){const photos=mediaPhotos();if(state.lightbox<0||state.lightbox>=photos.length){htmlEl('preview-root','');return;}const m=photos[state.lightbox];
 htmlEl('preview-root',`<div class="gallery-lightbox-overlay" role="dialog" aria-modal="true" aria-label="Xem ảnh lớn"><div class="gallery-lightbox-top"><div><strong>${esc(m['Chú thích']||m['Tên file'])}</strong><small>${state.lightbox+1} / ${photos.length} ảnh đã tải · ${esc(state.detail['Tên tư liệu'])}</small></div><div><a class="btn" href="${att(m['Link xem'])}" target="_blank" rel="noopener noreferrer">${ico('open_in_new')} Mở Drive</a><button class="btn" data-action="gallery-close-image">${ico('close')} Đóng</button></div></div>
 <div class="gallery-lightbox-main"><button class="gallery-lightbox-step" data-action="gallery-prev" ${state.lightbox===0?'disabled':''} aria-label="Ảnh trước">${ico('chevron_left')}</button><div class="gallery-lightbox-stage">${thumbHtml(m['File ID'],m['Tên file'],'gallery-lightbox-photo')}</div><button class="gallery-lightbox-step" data-action="gallery-next" ${state.lightbox>=photos.length-1?'disabled':''} aria-label="Ảnh sau">${ico('chevron_right')}</button></div>
 <div class="gallery-lightbox-caption">${esc(m['Chú thích']||'')}${canEdit()?`<button class="btn btn-sm" data-action="gallery-edit-caption" data-id="${att(m['Mã media'])}">Sửa chú thích</button>`:''}</div></div>`);}
 function closeImage(){state.lightbox=-1;htmlEl('preview-root','');}
 async function action(key,el){if(!site()&&key!=='gallery-close-image')return;if(state.deleting)return;const id=el.dataset.id;
 switch(key){case 'gallery-refresh':state.albums=null;return loadIndex(true);case 'gallery-open':return open(id);case 'gallery-back':state.request++;state.detail=null;state.media=[];closeImage();return renderIndex();
 case 'gallery-wizard-jump':return galleryWizardJump(el.dataset.step);case 'gallery-wizard-next':return galleryWizardNext();case 'gallery-wizard-back':return galleryWizardBack();case 'gallery-wizard-cancel':return galleryWizardCancel();case 'gallery-wizard-more':return loadWizardExisting();case 'gallery-wizard-move':return galleryWizardMove(el.dataset.key,Number(el.dataset.direction)||0);case 'gallery-wizard-remove':return galleryWizardRemove(el.dataset.key);
 case 'gallery-more':return loadMedia(false);case 'gallery-delete':return deleteAlbum();case 'gallery-edit':return albumForm(id?(state.albums||[]).find(x=>x['Mã tư liệu']===id):null);case 'gallery-save':return saveAlbum(id);
 case 'gallery-upload':return document.getElementById('gallery-upload-input')?.click();case 'gallery-cancel-upload':clearPending();closeModal();return;case 'gallery-confirm-upload':return uploadFiles();case 'gallery-sync':return sync();case 'gallery-set-cover':return setCover(id);case 'gallery-hide-media':return hideMedia(id);
 case 'gallery-edit-caption':return captionForm(id);case 'gallery-save-caption':return saveCaption(id);case 'gallery-open-media':return openMedia(id);
 case 'gallery-close-image':return closeImage();case 'gallery-prev':state.lightbox=Math.max(0,state.lightbox-1);return drawLightbox();case 'gallery-next':state.lightbox=Math.min(mediaPhotos().length-1,state.lightbox+1);return drawLightbox();
 case 'gallery-story-expand':{const p=document.getElementById('gallery-story');p?.classList.toggle('gallery-story-collapsed');el.innerHTML=p?.classList.contains('gallery-story-collapsed')?'Xem nội dung đầy đủ '+ico('expand_more'):'Thu gọn '+ico('expand_less');return;}
 }}
 document.addEventListener('input',e=>{if(e.target.id==='gallery-search'){state.query=e.target.value;renderCards();}if(state.form&&e.target.matches('[data-gallery-caption]')){const k=e.target.dataset.galleryCaption,item=[...state.form.existing,...state.form.files].find(x=>(x.key||x['Mã media'])===k);if(item){item.caption=e.target.value;setGalleryFormDirty();}}if(e.target.closest('#modal-root')&&e.target.id.startsWith('gal-'))setGalleryFormDirty();});
 document.addEventListener('change',e=>{
 if(e.target.id==='gal-group'&&state.form){const custom=document.getElementById('gal-group-custom');if(custom){custom.hidden=e.target.value!=='__other__';if(!custom.hidden)custom.focus();}setGalleryFormDirty();}
 if(e.target.id==='gallery-group'){state.group=e.target.value;renderCards();}if(e.target.id==='gallery-year'){state.year=e.target.value;renderCards();}if(e.target.id==='gallery-upload-input')onFiles([...e.target.files]);if(e.target.id==='gal-form-files'){galleryWizardFiles([...e.target.files]);}if(state.form&&e.target.matches('[data-gallery-cover]')){state.form.cover.key=e.target.dataset.galleryCover;document.querySelectorAll('.gallery-wizard-modal .gallery-cover-pick').forEach(x=>x.classList.toggle('selected',x.contains(e.target)));setGalleryFormDirty();}if(e.target.closest('#modal-root')&&e.target.id.startsWith('gal-'))setGalleryFormDirty();});
 document.addEventListener('error',e=>{if(!e.target.matches?.('img[data-gallery-img]'))return;const img=e.target, fallback=img.nextElementSibling;
  if(fallback?.classList.contains('gallery-photo-fallback')){img.style.display='none';fallback.hidden=false;}
  // Không RPC hàng loạt cho grid. Chỉ thử lấy ảnh thật khi ảnh lớn của bài hoặc viewer bị chặn.
  if(!img.closest('.gallery-detail-visual,.gallery-lightbox-stage')||img.dataset.galleryFallback==='1')return;
  img.dataset.galleryFallback='1';const id=img.dataset.galleryFile;if(!id)return;
  gas('galleryGetImageData',id,{timeout:40000}).then(r=>{if(!r?.success||!img.isConnected)return;img.onerror=null;img.src=r.dataUrl;img.style.display='block';if(fallback)fallback.hidden=true;}).catch(()=>{});
 },true);
 document.addEventListener('keydown',e=>{if(state.lightbox<0)return;if(e.key==='ArrowLeft'){e.preventDefault();state.lightbox=Math.max(0,state.lightbox-1);drawLightbox();}else if(e.key==='ArrowRight'){e.preventDefault();state.lightbox=Math.min(mediaPhotos().length-1,state.lightbox+1);drawLightbox();}else if(e.key==='Escape')closeImage();});
 return {show,action,onFiles,closeImage,discardForm:()=>{if(state.form&&!state.form.saving){releaseFormFiles();state.form=null;}},isUploading:()=>state.uploading||state.deleting,reset:()=>{clearPending();state.albums=null;state.detail=null;state.canDelete=false;state.request++;closeImage();}};
})();
