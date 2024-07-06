# dgnl-scraper
soy la javscript god

-----
# Đòi hỏi
- Một cái máy đã tải về node.js và một IDE tuỳ thích
- Một danh sách đầy đủ chứa thông tin CCCD, email và tên
(làm biếng tải docker về)

-----
# Cách sử dụng
1. Clone repo về trên máy
2. Thay dữ liệu trong information thảnh của mình, cách mỗi entry bằng dòng mới
3. Mở Command Prompt và điều hướng đến folder chứa cái repo, hoặc nếu đang xài IDE thì mở Terminal, xài `npm i`
4. Chạy chương trình, và hi vọng nó thành công

-----
# Lưu ý
để tránh nặng máy, code sẽ xử lý tối đa 100 dữ liệu, từ entry 1-100, 101-200 và vân vân. để đổi nơi lý, tại `index.js`, đổi tham số `BATCH_NUMBER` (ví dụ nếu muốn xử lý entry 1-100 thì đổi thành `1`, từ 101-200 đổi thành `2`, vân vân)

this code is not guaranteed to work 100% every year, có thể trang đgnl sẽ đổi, hoặc internals overhaul trong code chính web tra điểm, nếu có trục trặc, mở issue hoặc DM fungusdesu

-----
# License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
