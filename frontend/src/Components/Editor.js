import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
import axios from 'axios';
import MagicUrl from 'quill-magic-url'
import hljs from 'highlight.js'
import 'highlight.js/styles/stackoverflow-light.css'
import AttachmentIcon from '@mui/icons-material/Attachment';
import ImageIcon from '@mui/icons-material/ImageOutlined';
import '../assets/editor.css'

hljs.configure({
    languages: ['javascript', 'ruby', 'python', 'rust'],
})

const __ISMSIE__ = navigator.userAgent.match(/Trident/i) ? true : false;

Quill.register('modules/magicUrl', MagicUrl)

class Editor extends React.Component {
    currentId;
    question;
    bandId;
    empty;
    placeholder;
    onEditorChange;
    onFilesChange;
    onPollsChange;
    _isMounted;


    constructor(props) {
        super(props);
        this.state = {
            editorHtml: __ISMSIE__ ? "<p>&nbsp;</p>" : "",
            files: [],
        };

        this.reactQuillRef = null;
        this.inputOpenImageRef = React.createRef();
        this.inputOpenVideoRef = React.createRef();
        this.inputOpenFileRef = React.createRef();
    }

    componentDidMount() {
        console.log(this.props.empty)
        this._isMounted = true;
        if (this.props.currentId) {
           this.setState({ editorHtml: this.props.question?.body })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange = (html) => {
        this.setState({
            editorHtml: html
        });
        this.props.onEditorChange(this.state.editorHtml);
    }


    imageHandler = () => {
        this.inputOpenImageRef.current.click();
    };

    videoHandler = () => {
        this.inputOpenVideoRef.current.click();
    };

    fileHandler = () => {
        this.inputOpenFileRef.current.click();
    };


    insertImage = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.currentTarget && e.currentTarget.files && e.currentTarget.files.length > 0) {
            const file = e.currentTarget.files[0];

            let formData = new FormData();
            const config = {
                header: { 'content-type': 'multipart/form-data' }
            }
            formData.append("file", file);

            axios.post('/Api/uploadfiles', formData, config)
                .then(response => {
                    if (response.data.success) {
                        const quill = this.reactQuillRef.getEditor();
                        quill.focus();
                        let range = quill.getSelection();
                        let position = range ? range.index : 0;
                        quill.insertEmbed(position, "image", { src: "http://localhost:4000/" + response.data.url, alt: response.data.fileName });
                        quill.setSelection(position + 1);

                        this.setState({
                            files: [...this.state.files, file]
                        })
                        this.props.onFilesChange(this.state.files)
                    } 
                })
        }
    };

    insertVideo = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.currentTarget && e.currentTarget.files && e.currentTarget.files.length > 0) {
            const file = e.currentTarget.files[0];

            let formData = new FormData();
            const config = {
                header: { 'content-type': 'multipart/form-data' }
            }
            formData.append("file", file);

            axios.post('/Api/uploadfiles', formData, config)
                .then(response => {
                    if (response.data.success) {
                        const quill = this.reactQuillRef.getEditor();
                        quill.focus();
                        let range = quill.getSelection();
                        let position = range ? range.index : 0;
                        quill.insertEmbed(position, "video", { src: "http://localhost:4000/" + response.data.url, title: response.data.fileName });
                        quill.setSelection(position + 1);

                        this.setState({
                            files: [...this.state.files, file]
                        })
                        this.props.onFilesChange(this.state.files)
                    }
                })
        }

    }

    insertFile = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (e.currentTarget && e.currentTarget.files && e.currentTarget.files.length > 0) {
            const file = e.currentTarget.files[0];

            let formData = new FormData();
            const config = {
                header: { 'content-type': 'multipart/form-data' }
            }
            formData.append("file", file);

            axios.post('/Api/uploadfiles', formData, config)
                .then(response => {
                    if (response.data.success) {
                        const quill = this.reactQuillRef.getEditor();
                        quill.focus();
                        let range = quill.getSelection();
                        let position = range ? range.index : 0;
                        quill.insertEmbed(position, "file", response.data.fileName);
                        quill.setSelection(position + 1);
                        this.setState({
                            files: [...this.state.files, file]
                        })
                        this.props.onFilesChange(this.state.files)

                    }
                })
        }
    };

    render() {
        return (
            <div>
                <div id="toolbar-question">
                    <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                        <option value="1" >Heading 1</option>
                        <option value="2" >Heading 2</option>
                        <option value="3" >Heading 3</option>
                        <option value="4" >Heading 4</option>
                        <option value="" >Normal </option>
                    </select>


                    <button className="ql-bold" />
                    <button className="ql-italic" />
                    <button className="ql-underline" />
                    <button className="ql-strike" />
                    <button className="ql-script" value="sub"></button>
                    <button className="ql-script" value="super"></button>
                    <button className="ql-insertImage">
                        <ImageIcon />
                    </button>

                    <button className="ql-insertFile">
                        <AttachmentIcon />
                    </button>

                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-list" value="bullet"></button>
                    <button className="ql-indent" value="-1"></button>
                    <button className="ql-indent" value="+1"></button>
                    <button className="ql-direction" value="rtl"></button>
                    <span className="ql-formats">
                        <button className="ql-align" value=""></button>
                        <button className="ql-align" value="center"></button>
                    </span>
                    <button className="ql-code-block" />
                    <button className="ql-link" />
                    <button className="ql-blockquote" />
                    <button className="ql-clean" />


                </div>
                <ReactQuill
                    ref={(el) => { this.reactQuillRef = el }}
                    theme={'snow'}
                    onChange={this.handleChange}
                    modules={this.modules}
                    formats={this.formats}
                    value={!this.props.empty && !this.props.currentId ? "" : this.state.editorHtml }
                    placeholder={this.props.placeholder}
                />

                <input type="file" accept="image/*" ref={this.inputOpenImageRef} style={{ display: "none" }} onChange={this.insertImage} />
                <input type="file" accept="*" ref={this.inputOpenFileRef} style={{ display: "none" }} onChange={this.insertFile} />
            </div>

        )
    }

    modules = {
        syntax: true,
        magicUrl: true,
        clipboard: true,
        toolbar: {
            container: "#toolbar-question",
            handlers: {
                insertImage: this.imageHandler,
                insertVideo: this.videoHandler,
                insertFile: this.fileHandler,
                insertPoll: this.pollHandler,
            }
        },

    };

    formats = [
        'header', 'font',
        'bold', 'italic', 'underline', 'strike', 'script',
        'image', 'file', 'list', "indent", "code-block", 'link', "direction", 'formats', "blockquote", "clean"
    ];

}

export default Editor;



