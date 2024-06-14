# dgnl-scraper
ai sẽ thắng, trang web tạo bởi trường mang danh HCMUS được bảo vệ bởi recaptcha, hay là 1 thằng khoái miku rảnh hơi

-----
# Đòi hỏi
- Một cái máy đã tải về node.js và một IDE tuỳ thích
- Một danh sách đầy đủ chứa thông tin CCCD, lớp, email và tên (tuỳ mục đích sử dụng có thể điều chỉnh code nếu ko cần lớp hoặc tên, nhưng bắt buộc phải có CCCD và email)
- Kiến thức về Javascript, JSON và GitHub (nếu ko bt thì liên hệ 0946128824 zalo hoặc fungusdesu trên discord (trên discord có thể tưởng m là scammer nên có khả năng cao ko đọc tin nhắn))

-----
# Cách sử dụng
1. Clone repo về trên máy
2. Chứa cái repo trong một folder, trong cùng folder ấy, tạo 2 folders tên `information` và `result`, không viết hoa
3. Mở Command Prompt và điều hướng đến folder chứa cái repo, hoặc nếu đang xài IDE thì mở Terminal, xài `npm i`
4. Tạo 4 `.json` file `CCCD.json`, `name.json`, `class.json` và `email.json` chứa array thông tin **theo thứ tự**, vd thằng thứ nhất là entry 1 trong 4 file, thằng thứ hai là entry 2 trong 4 file, and so on and so forth
5. Chạy chương trình, và hi vọng nó thành công (nếu ko thành công thì mở issue trên github hoặc liên hệ)

-----
# Lưu ý
this code is not guaranteed to work 100% every year, có thể trang đgnl sẽ đổi, hoặc internals overhaul trong code chính web tra điểm. tới đó m tự sửa, hoặc liên hệ hoặc mở issue

-----
# License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
