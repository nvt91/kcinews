import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {KciAlignedPreview, type AlignedProps} from './KciAlignedPreview';
const defaults:AlignedProps={editingProfile:'KCI_EDIT_20261026_V1',headline:'KCI',edition:'PREVIEW',preview:true,technicalPreview:true,fps:30,durationInFrames:30,audioFile:'',scenes:[],beats:[]};
const Root:React.FC=()=> <Composition id="KciNewsDaily" component={KciAlignedPreview} width={1080} height={1920} fps={30} durationInFrames={30} defaultProps={defaults} calculateMetadata={({props})=>({fps:props.fps,durationInFrames:props.durationInFrames})}/>;
registerRoot(Root);
