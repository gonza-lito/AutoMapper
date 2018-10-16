# AutoMapper

This a nodejs port from Automapper-ts lib.

## Changes:
* Remove global scope variable
* Refactored all ts code.
* Changed unit test to jest
* Removed support for currying.

This is a TypeScript / Javascript AutoMapper implementation. The pursuit of this implementation is to mimic both usage and functionality of the [original .NET AutoMapper library](https://github.com/AutoMapper/AutoMapper).

## What is AutoMapper?
AutoMapper is a fairly small library built to solve a deceptively complex problem - getting rid of code that mapped one object to another. This type of code is rather dreary and boring to write, so why not use a tool to do it for us?
Since most of us already are familiar with AutoMapper in .NET, our belief was there should be an somewhat similar implementation for JavaScript. Unfortunately, such library did not exist already. Well, here it finally is: an Automapper
implementation for use in TypeScript / Javascript, entirely built and tested using TypeScript.

## How do I get started?
Check out the [getting started guide](https://github.com/loedeman/AutoMapper/wiki/Getting-started). When you're done there, the [wiki](https://github.com/loedeman/AutoMapper/wiki) provides a more thorough documentation. Should you have any remarks / questions, you can get in touch with the team: we are more than happy to be of assistance. Of course, you can always follow [@AutoMapperTS](https://twitter.com/AutomapperTS) on Twitter for update notifications.

## Where can I get it?
First, install npm. Then, install [AutoMapperTS](https://www.npmjs.com/package/automapper-ts) from NPM:

[![automapper-ts-node @ npmjs.com](https://nodei.co/npm/automapper-ts-node.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/automapper-ts-node)

	npm install automapper-ts-node

[npm-url]: https://npmjs.org/package/automapper-ts-node
[npm-image]: https://img.shields.io/npm/v/automapper-ts-node.svg?style=flat-square
