import assert from "node:assert/strict";
import { reviewVariety, normalize, similarity, slotOf } from "./check-editorial-variety.mjs";

const sample=(id,slot,hook,q,closing,arc)=>({
  schemaVersion:2,id,metadata:{slot},edition:slot,
  hook:{spoken:hook},
  scenes:[{voiceText:hook+" Trên thị trường, số liệu thay đổi trong phiên."}],
  cta:{type:"comment",question:q,spoken:q+" "+closing},
  variationReview:arc?{arcId:arc}:{}
});
const q="Theo mọi người, điều gì sẽ cho thấy thị trường đã thực sự ổn định trở lại?";
const closing="Hãy chia sẻ góc nhìn tại phần bình luận và theo dõi kênh để cùng cập nhật những diễn biến tiếp theo nhé.";
const a=sample("a","KR_CLOSE","KOSPI bất ngờ giảm mạnh trong phiên khi nhóm bán dẫn chịu áp lực.",q,closing,"A02");
const b=sample("b","KR_CLOSE","KOSPI bất ngờ giảm mạnh trong phiên khi nhóm bán dẫn chịu áp lực.",q,closing,"A02");
const c=sample("c","US_AM","Phiên Mỹ cho thấy công nghệ và lãi suất có những động lực khác nhau.",
 "Tín hiệu nào từ Phố Wall có thể tác động mạnh đến thị trường Hàn Quốc?",
 "Mọi người có thể để lại nhận xét và theo dõi những cập nhật mới trên kênh nhé.","A04");
const d=sample("d","KR_CLOSE","Khối ngoại bán ròng nhưng tổ chức lại mua mạnh vào cuối phiên.",
 "Sau quyết định của cơ quan quản lý, dữ liệu thực thi nào đáng theo dõi?",
 "Hẹn gặp ở một bản tin khác với những thông tin mới đã được kiểm chứng.","A05");
assert.equal(normalize("ĐỈNH / giá 4.708,54"),"dinh gia 4 708 54");
assert.ok(similarity(q,q)>0.99);
assert.equal(slotOf({metadata:{slot:"US_AM"}}),"US_AM");
let result=reviewVariety(b,[a,c]);
assert.ok(result.issues.some(x=>x.code==="HOOK_REPEAT"));
assert.ok(result.issues.some(x=>x.code==="QUESTION_REPEAT"));
assert.ok(result.issues.some(x=>x.code==="FOLLOW_INVITE_REPEAT"));
assert.ok(!result.issues.some(x=>x.with==="c" && x.code==="HOOK_REPEAT"));
result=reviewVariety(d,[b,a,c]);
assert.ok(!result.issues.some(x=>x.code==="HOOK_REPEAT"));
assert.ok(!result.issues.some(x=>x.code==="QUESTION_REPEAT"));
assert.ok(result.issues.length===0);
result=reviewVariety(sample("e","KR_CLOSE","KOSPI có sự thay đổi về dòng vốn và thanh khoản.",
 "Tín hiệu nào trên thị trường chứng khoán đáng được chú ý?",closing,"A02"),[a,b]);
assert.ok(result.issues.some(x=>x.code==="ARC_3_IN_ROW"));
console.log("PASS editorial variety advisory tests (no network/Vbee/no blocking).");
