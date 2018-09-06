# FBL or FireBlink Logistics

[![Greenkeeper badge](https://badges.greenkeeper.io/FireBlinkLTD/fbl.svg)](https://greenkeeper.io/)
[![CircleCI](https://circleci.com/gh/FireBlinkLTD/fbl.svg?style=svg)](https://circleci.com/gh/FireBlinkLTD/fbl)
[![codecov](https://codecov.io/gh/FireBlinkLTD/fbl/branch/master/graph/badge.svg)](https://codecov.io/gh/FireBlinkLTD/fbl)

This is a second reincarnation on internal tool that FireBlink LTD used to deploy its own projects.
Original tool was vendor locked and had pretty much limited functionality.

The new one, README of which you're currently reading is redesigned from scratch to fix that limitation.
Even more, due to plugin nature it can process any kind of flows, even non related to deployments.

FBL generally designed to help with automation related tasks that require flexible control over the flow.

# Usage

Flexibility is the key concept of the FBL, so it can be used either as a command line tool, or integrated into any
existing Node.js app.

FBL by its own just provides a generally limited amount of embedded plugins and for real life usage may require 3rd party plugins.

## Requirements

- Node.js v8+ (earlier version may also work, but not supported officially)

## Installation 

Just run `npm i -g fbl` to install the CLI.

## Flow file format

```yaml
# [Optional] flow version, it is up to the user whether to use it or not
version: 1.0.0

# [Optional] flow description, it is up to the user whether to describe a flow in a human readable way
description: |-
  Plugn invoker.

# [Required] The starting point of the flow.
pipeline:
   # Pipeline may only have one key that represents action handler ID or one of its aliases
   # value is action handler specific, make sure to read corresponding documentation first  
   'plugin.id': 'plugin.options'
   
   # Metadata
   # Each action may have additional metadata associated with it
   # Naming convention: all metadata fields should start with dollar sign - $.
   # Action Ids or aliases could not start with $.   
   $title: 'Human readable title of action'
``` 

## Default Plugins

- [Context](docs/plugins/context.md)
- [Exec](docs/plugins/exec.md)
- [Flow Control](docs/plugins/flow.md)
- [File System](docs/plugins/fs.md)
- [Execution Reporters](docs/plugins/reporters.md)

## Global Config

Create folder `.fbl` inside your user home directory. Put `config` file inside it with following format:

```yaml
# Provide a list of globally installed plugins or absolute paths
# Has same effect as "-p" option.
plugins:
  - fbl-plugin-name
  - /home/user/test/fbl-plugins/fbl-plugin-name
  
# Provide list of context key=value pairs
# Has same effect as "-c" option.
# Note: if you will provide just a key you will get prompted to provide a value each time you invoke the "fbl" cli
context:
  - key=value

# Provide list of secrets key=value pairs
# Has same effect as "-s" option.
# Note: if you will provide just a key you will get prompted to provide a value each time you invoke the "fbl" cli
secrets:
  - key=value

# Disable console colorful output
# Has same effect as "--no-colors" option
no-colors: true
```