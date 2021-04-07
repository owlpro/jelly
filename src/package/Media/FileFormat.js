import React, { Component, Fragment } from "react";

import aac from "./icon/aac.svg";
import ai from "./icon/ai.svg";
import avi from "./icon/avi.svg";
import bmp from "./icon/bmp.svg";
import cad from "./icon/cad.svg";
import cdr from "./icon/cdr.svg";
import css from "./icon/css.svg";
import dat from "./icon/dat.svg";
import dll from "./icon/dll.svg";
import dmg from "./icon/dmg.svg";
import doc from "./icon/doc.svg";
import eps from "./icon/eps.svg";
import fla from "./icon/fla.svg";
import flv from "./icon/flv.svg";
import gif from "./icon/gif.svg";
import html from "./icon/html.svg";
import indd from "./icon/indd.svg";
import iso from "./icon/iso.svg";
import jpg from "./icon/jpg.svg";
import js from "./icon/js.svg";
import midi from "./icon/midi.svg";
import mov from "./icon/mov.svg";
import mp3 from "./icon/mp3.svg";
import mpg from "./icon/mpg.svg";
import pdf from "./icon/pdf.svg";
import php from "./icon/php.svg";
import png from "./icon/png.svg";
import ppt from "./icon/ppt.svg";
import ps from "./icon/ps.svg";
import psd from "./icon/psd.svg";
import raw from "./icon/raw.svg";
import sql from "./icon/sql.svg";
import svg from "./icon/svg.svg";
import tif from "./icon/tif.svg";
import txt from "./icon/txt.svg";
import wmv from "./icon/wmv.svg";
import xls from "./icon/xls.svg";
import xml from "./icon/xml.svg";
import zip from "./icon/zip.svg";
import xlsx from "./icon/xlsx.svg";
import apk from "./icon/apk.svg";
import sh from "./icon/sh.svg";
import jpeg from "./icon/jpeg.svg";

class FileFormat extends Component {
    icons = {
        aac: aac,
        ai: ai,
        avi: avi,
        bmp: bmp,
        cad: cad,
        cdr: cdr,
        css: css,
        dat: dat,
        dll: dll,
        dmg: dmg,
        doc: doc,
        eps: eps,
        fla: fla,
        flv: flv,
        gif: gif,
        html: html,
        indd: indd,
        iso: iso,
        jpg: jpg,
        js: js,
        midi: midi,
        mov: mov,
        mp3: mp3,
        mpg: mpg,
        pdf: pdf,
        php: php,
        png: png,
        ppt: ppt,
        ps: ps,
        psd: psd,
        raw: raw,
        sql: sql,
        svg: svg,
        tif: tif,
        txt: txt,
        wmv: wmv,
        xls: xls,
        xml: xml,
        zip: zip,
        xlsx: xlsx,
        apk: apk,
        sh: sh,
        jpeg: jpeg
    }
    render() {
        let icon = this.icons[this.props.format];
        if (icon) {
            return (
                <Fragment>
                    <img src={icon} {...this.props} draggable={false} alt={this.props.format} />
                </Fragment>
            )
        }
        return <b>{this.props.format.toUpperCase()}</b>;
    }
}

export default FileFormat;
