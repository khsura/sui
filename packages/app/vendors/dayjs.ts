import dayjs, { extend } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import localeData from 'dayjs/plugin/localeData.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
import minMax from 'dayjs/plugin/minMax.js'
import objectSupport from 'dayjs/plugin/objectSupport.js'
import toObject from 'dayjs/plugin/toObject.js'

extend(localizedFormat)
extend(localeData)
extend(objectSupport)
extend(customParseFormat)
extend(isBetween)
extend(minMax)
extend(isSameOrBefore)
extend(toObject)

export default dayjs
