"use strict";
// IMPORTANT: Do not put the old MG2 Apps Script URL here. First update the
// Google Apps Script to route MG3 submissions to the "MG3 Results" sheet.
const RESULTS_ENDPOINT = "";
const CLASS_NAME = "3-4";
const STORAGE_PREFIX = "mg3u4_v1_";
let sections=[],student="",current=0,answers={},submitted=false;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const all=()=>sections.flatMap(s=>s.questions);
const key=()=>STORAGE_PREFIX+student.trim().toLowerCase()+"_"+CLASS_NAME;
function save(){localStorage.setItem(key(),JSON.stringify({answers,submitted}));}
function answered(q){return typeof answers[q.id]==='string'&&answers[q.id].trim().length>0;}
function render(){
 const s=sections[current];$('sectionTitle').textContent=s.title;$('counter').textContent=`Section ${current+1} / ${sections.length}`;
 $('bar').style.width=`${all().filter(answered).length/all().length*100}%`;
 $('questions').innerHTML=s.questions.map((q,i)=>`<div class="question"><h3>${i+1}. ${esc(q.prompt)}</h3>${q.type==='choice'?q.options.map((o,j)=>`<label class="option"><input type="radio" name="${esc(q.id)}" value="${esc(o)}" ${answers[q.id]===o?'checked':''} ${submitted?'disabled':''}><span>${String.fromCharCode(65+j)}. ${esc(o)}</span></label>`).join(''):`<textarea data-id="${esc(q.id)}" ${submitted?'disabled':''} placeholder="Type your answer here...">${esc(answers[q.id]||'')}</textarea>`}</div>`).join('');
 $('questions').querySelectorAll('input[type=radio]').forEach(el=>el.addEventListener('change',()=>{answers[el.name]=el.value;save();render();}));
 $('questions').querySelectorAll('textarea').forEach(el=>el.addEventListener('input',()=>{answers[el.dataset.id]=el.value;save();$('bar').style.width=`${all().filter(answered).length/all().length*100}%`;}));
 $('prev').disabled=current===0;$('next').disabled=current===sections.length-1;$('submit').disabled=submitted;
 $('feedback').textContent=submitted?'This workbook has already been submitted on this device.':'';
}
function score(){let obj=all().filter(q=>q.type==='choice');let correct=obj.filter(q=>answers[q.id]===q.answer).length;return {correct,total:obj.length,percentage:Math.round(100*correct/obj.length)};}
$('start').addEventListener('click',()=>{student=$('student').value.trim().replace(/\s+/g,' ');if(student.length<3){alert('Please enter your full name.');return;}let stored;try{stored=JSON.parse(localStorage.getItem(key())||'{}');}catch{}answers=stored?.answers||{};submitted=!!stored?.submitted;$('welcome').classList.add('hidden');$('workspace').classList.remove('hidden');render();});
$('prev').addEventListener('click',()=>{if(current>0){current--;render();window.scrollTo(0,0);}});
$('next').addEventListener('click',()=>{if(current<sections.length-1){current++;render();window.scrollTo(0,0);}});
$('check').addEventListener('click',()=>{const q=sections[current].questions.filter(x=>x.type==='choice');const done=q.filter(answered).length;const correct=q.filter(x=>answers[x.id]===x.answer).length;$('feedback').textContent=`This section: ${correct} correct out of ${q.length} automatically graded questions (${done} answered). Written answers are reviewed by your teacher.`;});
$('submit').addEventListener('click',async()=>{
 if(submitted){alert('Already submitted on this device.');return;}
 const missing=all().filter(q=>!answered(q));if(missing.length){alert(`Please answer all ${missing.length} remaining questions before submitting.`);current=sections.findIndex(s=>s.questions.some(q=>!answered(q)));render();return;}
 if(!RESULTS_ENDPOINT){$('feedback').textContent='Teacher setup required: the Google Sheets connection is not configured yet. Your answers remain saved on this device.';return;}
 if(!confirm('Submit all your answers to your teacher now?'))return;
 const s=score();const payload={workbook:'MG3',unit:'4',studentName:student,studentClass:CLASS_NAME,score:s.correct,totalQuestions:s.total,percentage:s.percentage,answers:answers,submissionId:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`};
 $('submit').disabled=true;$('feedback').textContent='Sending...';
 try{const res=await fetch(RESULTS_ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow'});
 // Apps Script may not expose CORS headers. Do not claim server receipt from opaque/no-cors responses.
 if(!res.ok)throw Error('HTTP '+res.status);
 submitted=true;save();$('feedback').textContent='Request sent. Ask your teacher to verify your result in Google Sheets.';
 }catch(e){$('feedback').textContent='Could not confirm delivery. Your answers are saved here. Please contact your teacher before retrying.';$('submit').disabled=false;}
});
fetch('questions.json').then(r=>{if(!r.ok)throw Error('Question file not found');return r.json()}).then(data=>{sections=data;}).catch(()=>{$('welcome').insertAdjacentHTML('beforeend','<p class="wrong">Unable to load questions. Please refresh the page.</p>');$('start').disabled=true;});
