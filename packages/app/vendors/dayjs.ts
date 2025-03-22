import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import localeData from 'dayjs/plugin/localeData.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
import minMax from 'dayjs/plugin/minMax.js'
import objectSupport from 'dayjs/plugin/objectSupport.js'
import toObject from 'dayjs/plugin/toObject.js'

dayjs.extend(localizedFormat)
dayjs.extend(localeData)
dayjs.extend(objectSupport)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
dayjs.extend(minMax)
dayjs.extend(isSameOrBefore)
dayjs.extend(toObject)
dayjs.locale('en')

export default dayjs
