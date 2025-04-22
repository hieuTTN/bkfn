import StyleFooter from '../header/header.scss'
import logofooter from '../../../assest/images/footer.png'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import {getMethodByToken, postMethodPayload, getMethodPostByToken, urlGlobal} from '../../../services/request';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


function Footer(){
  const [client, setClient] = useState(null);
  const [itemChat, setItemChat] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    var token = window.localStorage.getItem("token");
    if(token == null){
      return;
    }
    const getUser = async() =>{
        var response = await getMethodPostByToken("http://localhost:8080/api/user/user-logged")
        var result = await response.json();
        console.log(result);
        
        setUser(result)
    };
    getUser();
    const getMess= async() =>{
        var response = await getMethodByToken('http://localhost:8080/api/chat/user/my-chat');
        var result = await response.json();
        setItemChat(result)
    };
    getMess();

    var userlc = localStorage.getItem("user")
    var email = JSON.parse(userlc).email
    var url = urlGlobal();
    const sock = new SockJS(url+'/hello');
    const stompClient = new Client({
    webSocketFactory: () => sock,
    onConnect: () => {
        console.log("WebSocket connected successfully!");
        stompClient.subscribe('/users/queue/messages', (msg) => {
            var Idsender = msg.headers.sender
            appendRecivers(msg.body, Idsender)
        });
    },
    connectHeaders: {
        username: email  // Truyền email vào header khi kết nối
    }
    });
    stompClient.activate();
    setClient(stompClient);

    return () => {
        stompClient.deactivate();
    };
  }, []);


  function clickSendMess(){
    client.publish({
      destination: '/app/hello/-10',
      body: document.getElementById("contentmess").value,
    });
    append()
  }

  function enterSendMess(e){
      var key = e.which;
      if(key == 13)  // the enter key code
      {
        client.publish({
          destination: '/app/hello/-10',
          body: document.getElementById("contentmess").value,
        });
        append()
      }
  }

  function append() {
      var tinhan = document.createElement('p');
      tinhan.className = "mychat";
      tinhan.textContent = document.getElementById("contentmess").value; 
      document.getElementById('listchat').appendChild(tinhan);
      var scroll_to_bottom = document.getElementById('listchat');
      scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
      document.getElementById("contentmess").value = ''
  }

  function appendRecivers (message) {
      var cont = document.createElement('p');
      cont.className = "adminchat";
      cont.textContent = message;
      document.getElementById('listchat').appendChild(cont);
      var scroll_to_bottom = document.getElementById('scroll-to-bottom');
      scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
  }

  
function toggleChat() {
  var chatBox = document.getElementById("chat-box");
  var btnopenchat = document.getElementById("btnopenchat");
  if (chatBox.style.display === "none" || chatBox.style.display === "") {
      chatBox.style.display = "block";
      chatBox.style.bottom = "20px";
      btnopenchat.style.display = 'none'
  }
  else {
      chatBox.style.display = "none";
      btnopenchat.style.display = ''
  }
}



    return(
        <div id='footer'>
          <footer class="text-center text-lg-start text-muted">
    <section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
      <div class="me-5 d-none d-lg-block"></div>
      <div>
        <a href="" class="me-4 text-reset"><i class="fab fa-facebook-f"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-twitter"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-google"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-instagram"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-linkedin"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-github"></i></a>
      </div>
    </section>
    <section class="">
      <div class=" text-center text-md-start mt-5">
        <div class="row mt-3">
          <div class="col-md-2 col-lg-2 col-xl-3 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">HỖ TRỢ KHÁCH HÀNG 24/7</h6>
            <p><a href="#!" class="text-reset">Điều khoản dịch vụ</a></p>
            <p><a href="#!" class="text-reset">Liên hệ hỗ trợ</a></p>
            <p><a href="#!" class="text-reset">Câu hỏi thường gặp</a></p>
          </div>
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">DỊCH VỤ CUNG CẤP</h6>
            <p><a href="#!" class="text-reset">Nhà</a></p>
            <p><a href="#!" class="text-reset">Căn hộ</a></p>
            <p><a href="#!" class="text-reset">Resort</a></p>
            <p><a href="#!" class="text-reset">Biệt thự</a></p>
            <p><a href="#!" class="text-reset">Nhà khách</a></p>
          </div>
          <div class="col-md-4 col-lg-4 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">VỀ CHÚNG TÔI</h6>
            <div>
                Mường Thanh Luxury là phân khúc khách sạn hạng sang cao cấp nhất của Mường Thanh, nằm ở các thành phố lớn và trung tâm du lịch nổi tiếng trong nước và quốc tế. Quy mô lớn và đẳng cấp khác biệt, Mường Thanh Luxury mang đến cho khách hàng không gian nghỉ dưỡng tuyệt vời mang đậm giá trị Việt đến từ dịch vụ tận tâm và văn hóa ẩm thực bản địa độc đáo.
            </div>
          </div>
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <img src={logofooter} class="imgfooter" />
          </div>
        </div>
      </div>
    </section>
</footer>

          <div class="chat-container" id="btnchatbottom">
              <button class="chat-button" id="btnopenchat" onClick={toggleChat}><i class="fa fa-comment"></i> Chat với chúng tôi</button>

              <div id="chat-box" class="chat-box">
                  <div class="chat-header">
                      <h3>Xin chào bạn!</h3>
                      <button class="close-btn" onClick={toggleChat}>X</button>
                  </div>
                  <div class="chat-body" id="scroll-to-bottom">
                      <div id="listchat">
                        {itemChat.map((item, index)=>{
                          if(item.sender.id == user.id){
                            return <p class="mychat">{item.content}</p>
                          }
                          else{
                            return <p class="adminchat">{item.content}</p>
                          }
                        })}
                      </div>
                  </div>
                  <div class="chat-footer">
                      <input onKeyUp={(e)=>enterSendMess(e)} type="text" id="contentmess" placeholder="Nhập tin nhắn..." />
                      <button onClick={()=>clickSendMess()} id="sendmess">Gửi</button>
                  </div>
              </div>
          </div>  
        </div>
    );
}

export default Footer;