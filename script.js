async function bootstrapAuthenticated(){
  showEl('loading-screen');hideEl('app-container');hideEl('login-view');hideEl('loading-retry');
  setText('loading-heading','Đang chuẩn bị dữ liệu');setText('loading-status','Đang preload dữ liệu theo quyền');
  setText('loading-description','Tác vụ Drive, email và thư viện Excel không chạy trong bootstrap.');
  try{
    const data=await gas('getBootstrapData',{timeout:90000}),expected=document.querySelector('meta[name="app-build"]')?.content||'';
    if(expected&&expected!==data.version)throw Error('Giao diện và backend chưa cùng phiên bản. Hãy triển khai lại bản mới.');
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

const API_URL = 'https://script.google.com/macros/s/AKfycbz-n9ztJiJQth6rAFp6eJAG2xwGAdrFxVtn89WARzHXvsauxcZfaJrk9ggnb6W7KkK9gQ/exec';

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
