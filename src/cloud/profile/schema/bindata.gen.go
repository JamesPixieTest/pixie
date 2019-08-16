// Code generated by go-bindata.
// sources:
// 000001_create_org_user_tables.down.sql
// 000001_create_org_user_tables.up.sql
// DO NOT EDIT!

package schema

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func bindataRead(data []byte, name string) ([]byte, error) {
	gz, err := gzip.NewReader(bytes.NewBuffer(data))
	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}

	var buf bytes.Buffer
	_, err = io.Copy(&buf, gz)
	clErr := gz.Close()

	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}
	if clErr != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

type asset struct {
	bytes []byte
	info  os.FileInfo
}

type bindataFileInfo struct {
	name    string
	size    int64
	mode    os.FileMode
	modTime time.Time
}

func (fi bindataFileInfo) Name() string {
	return fi.name
}
func (fi bindataFileInfo) Size() int64 {
	return fi.size
}
func (fi bindataFileInfo) Mode() os.FileMode {
	return fi.mode
}
func (fi bindataFileInfo) ModTime() time.Time {
	return fi.modTime
}
func (fi bindataFileInfo) IsDir() bool {
	return false
}
func (fi bindataFileInfo) Sys() interface{} {
	return nil
}

var __000001_create_org_user_tablesDownSql = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x72\x09\xf2\x0f\x50\x08\x71\x74\xf2\x71\x55\xf0\x74\x53\x70\x8d\xf0\x0c\x0e\x09\x56\x28\x2d\x4e\x2d\x2a\xb6\xe6\xc2\x2a\x97\x5f\x94\x5e\x6c\xcd\x05\x08\x00\x00\xff\xff\x93\xee\xc5\x1a\x37\x00\x00\x00")

func _000001_create_org_user_tablesDownSqlBytes() ([]byte, error) {
	return bindataRead(
		__000001_create_org_user_tablesDownSql,
		"000001_create_org_user_tables.down.sql",
	)
}

func _000001_create_org_user_tablesDownSql() (*asset, error) {
	bytes, err := _000001_create_org_user_tablesDownSqlBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "000001_create_org_user_tables.down.sql", size: 55, mode: os.FileMode(436), modTime: time.Unix(1565979770, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var __000001_create_org_user_tablesUpSql = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x74\x90\xbd\x6e\xc2\x30\x14\x85\x77\x3f\xc5\x19\x6d\xa9\x43\x3a\x74\xea\x94\xa6\x37\x95\x55\x08\x60\xe2\x21\x13\xb2\x48\x00\x4b\xf9\x91\x1c\xe0\xf9\xd1\x05\x81\x12\xa2\xac\xdf\x39\xf2\xf9\x7c\x13\x43\x71\x4e\xc8\xe3\x9f\x05\xa1\x0b\xc7\x1e\x52\x00\xbe\x84\xb5\xfa\xf7\x43\x80\xd9\xae\x75\x4d\x85\xab\x0b\xfb\x93\x0b\xf2\x2b\x52\xb0\x99\xde\x58\xe2\xb8\xec\x1a\xe7\xdb\xf9\x86\x00\xd6\x46\x2f\x63\x53\xe0\x9f\x0a\xe9\x4b\x25\xd4\xb7\x10\xa3\xd9\x4b\x5f\x85\xd1\xee\xe0\x7d\x9e\x1f\xd8\x70\xf5\x7d\x8b\xf9\xc1\x87\xfe\x3c\xb1\xe0\xa4\x76\x33\x41\xd5\x38\x5f\xbf\xe0\x67\xc4\x74\x6a\xcb\xcd\x74\x65\x48\xff\x65\x8c\x20\x1f\x42\x0a\x86\x52\x32\x94\x25\xb4\xbd\x9f\xed\xf9\xb3\x5b\x00\x00\x00\xff\xff\x14\xfc\x5e\xe6\x50\x01\x00\x00")

func _000001_create_org_user_tablesUpSqlBytes() ([]byte, error) {
	return bindataRead(
		__000001_create_org_user_tablesUpSql,
		"000001_create_org_user_tables.up.sql",
	)
}

func _000001_create_org_user_tablesUpSql() (*asset, error) {
	bytes, err := _000001_create_org_user_tablesUpSqlBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "000001_create_org_user_tables.up.sql", size: 336, mode: os.FileMode(436), modTime: time.Unix(1565980172, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

// Asset loads and returns the asset for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func Asset(name string) ([]byte, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("Asset %s can't read by error: %v", name, err)
		}
		return a.bytes, nil
	}
	return nil, fmt.Errorf("Asset %s not found", name)
}

// MustAsset is like Asset but panics when Asset would return an error.
// It simplifies safe initialization of global variables.
func MustAsset(name string) []byte {
	a, err := Asset(name)
	if err != nil {
		panic("asset: Asset(" + name + "): " + err.Error())
	}

	return a
}

// AssetInfo loads and returns the asset info for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func AssetInfo(name string) (os.FileInfo, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("AssetInfo %s can't read by error: %v", name, err)
		}
		return a.info, nil
	}
	return nil, fmt.Errorf("AssetInfo %s not found", name)
}

// AssetNames returns the names of the assets.
func AssetNames() []string {
	names := make([]string, 0, len(_bindata))
	for name := range _bindata {
		names = append(names, name)
	}
	return names
}

// _bindata is a table, holding each asset generator, mapped to its name.
var _bindata = map[string]func() (*asset, error){
	"000001_create_org_user_tables.down.sql": _000001_create_org_user_tablesDownSql,
	"000001_create_org_user_tables.up.sql": _000001_create_org_user_tablesUpSql,
}

// AssetDir returns the file names below a certain
// directory embedded in the file by go-bindata.
// For example if you run go-bindata on data/... and data contains the
// following hierarchy:
//     data/
//       foo.txt
//       img/
//         a.png
//         b.png
// then AssetDir("data") would return []string{"foo.txt", "img"}
// AssetDir("data/img") would return []string{"a.png", "b.png"}
// AssetDir("foo.txt") and AssetDir("notexist") would return an error
// AssetDir("") will return []string{"data"}.
func AssetDir(name string) ([]string, error) {
	node := _bintree
	if len(name) != 0 {
		cannonicalName := strings.Replace(name, "\\", "/", -1)
		pathList := strings.Split(cannonicalName, "/")
		for _, p := range pathList {
			node = node.Children[p]
			if node == nil {
				return nil, fmt.Errorf("Asset %s not found", name)
			}
		}
	}
	if node.Func != nil {
		return nil, fmt.Errorf("Asset %s not found", name)
	}
	rv := make([]string, 0, len(node.Children))
	for childName := range node.Children {
		rv = append(rv, childName)
	}
	return rv, nil
}

type bintree struct {
	Func     func() (*asset, error)
	Children map[string]*bintree
}
var _bintree = &bintree{nil, map[string]*bintree{
	"000001_create_org_user_tables.down.sql": &bintree{_000001_create_org_user_tablesDownSql, map[string]*bintree{}},
	"000001_create_org_user_tables.up.sql": &bintree{_000001_create_org_user_tablesUpSql, map[string]*bintree{}},
}}

// RestoreAsset restores an asset under the given directory
func RestoreAsset(dir, name string) error {
	data, err := Asset(name)
	if err != nil {
		return err
	}
	info, err := AssetInfo(name)
	if err != nil {
		return err
	}
	err = os.MkdirAll(_filePath(dir, filepath.Dir(name)), os.FileMode(0755))
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(_filePath(dir, name), data, info.Mode())
	if err != nil {
		return err
	}
	err = os.Chtimes(_filePath(dir, name), info.ModTime(), info.ModTime())
	if err != nil {
		return err
	}
	return nil
}

// RestoreAssets restores an asset under the given directory recursively
func RestoreAssets(dir, name string) error {
	children, err := AssetDir(name)
	// File
	if err != nil {
		return RestoreAsset(dir, name)
	}
	// Dir
	for _, child := range children {
		err = RestoreAssets(dir, filepath.Join(name, child))
		if err != nil {
			return err
		}
	}
	return nil
}

func _filePath(dir, name string) string {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	return filepath.Join(append([]string{dir}, strings.Split(cannonicalName, "/")...)...)
}

