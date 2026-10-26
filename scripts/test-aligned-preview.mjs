import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import crypto from 'node:crypto';
import {verifyFinalApproval} from './run-voiced-preview.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'kci-approval-test-'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const put=(f,d)=>fs.writeFileSync(path.join(root,f),JSON.stringify(d));
try{
  assert.throws(()=>verifyFinalApproval(root),/OWNER_APPROVAL_REQUIRED/);
  fs.writeFileSync(path.join(root,'preview.mp4'),'TEST ONLY, not media');
  put('aligned-props.json',{testOnly:true});
  const identity={previewSha256:sha(path.join(root,'preview.mp4')),propsSha256:sha(path.join(root,'aligned-props.json')),audioSha256:'test-only-audio-hash'};
  put('preview-identity.json',identity);
  put('approval.json',{stage:'final',approvedBy:'nvt91',...identity,reference:'unit-test-fixture-not-a-real-approval',approvedAt:'2026-10-26T10:00:00Z',checks:{listening:'PASS',wordSync:'PASS',facts:'PASS'}});
  assert.doesNotThrow(()=>verifyFinalApproval(root,path.join(root,'approval.json')));
  put('approval.json',{...JSON.parse(fs.readFileSync(path.join(root,'approval.json'))),previewSha256:'wrong'});
  assert.throws(()=>verifyFinalApproval(root,path.join(root,'approval.json')),/APPROVAL_CUT_MISMATCH/);
  put('approval.json',{stage:'final',approvedBy:'nvt91',...identity,reference:'test',approvedAt:'2026-10-26T10:00:00Z',checks:{listening:'NOT_MEASURED',wordSync:'PASS',facts:'PASS'}});
  assert.throws(()=>verifyFinalApproval(root,path.join(root,'approval.json')),/APPROVAL_EVIDENCE_INCOMPLETE/);
  console.log('PASS: missing approval, valid fixture, mismatched cut and missing listening checks');
}finally{fs.rmSync(root,{recursive:true,force:true});}
