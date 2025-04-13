import { GuardantStatus } from '../guardant.types';

export enum EventScope {
    VersionManager = 'versionmanager',
    Guardant = 'guardant',
    Misc = 'misc',
}
export type EventType = 'error' | 'success' | 'info' | 'warning';

type EventDefinition = {
    message: string;
    type: EventType;
};

type EventMap = {
    [key in EventScope]: Record<number, EventDefinition>;
};
export class AtEventHandler {
    constructor(private scope: EventScope, private code: number) { }

    getMessage(): string {
        return EVENT_DATA[this.scope]?.[this.code]?.message ?? 'Неизвестная ошибка';
    }

    getType(): EventType {
        return EVENT_DATA[this.scope]?.[this.code]?.type ?? 'info';
    }
}
export enum VersionManagerErrorCode {
    DownloadFailed = 1,
    InstallFailed = 2,
    ImportFailed = 3,
    UninstallFailed = 4,
    ExportFailed = 5,
    LaunchFailed = 6,
    ExecutableNotFound = 7,
    MetaFileMissing = 8
  }
export const EVENT_DATA: EventMap = {
    [EventScope.VersionManager]: {
        [VersionManagerErrorCode.DownloadFailed]: { message: 'Ошибка при загрузке версии продукта', type: 'error', },
        [VersionManagerErrorCode.InstallFailed]: { message: 'Ошибка при установке версии продукта', type: 'error', },
        [VersionManagerErrorCode.ImportFailed]: { message: 'Ошибка при импорте версии из архива', type: 'error', },
        [VersionManagerErrorCode.UninstallFailed]: { message: 'Ошибка при удалении версии продукта', type: 'error', },
        [VersionManagerErrorCode.ExportFailed]: { message: 'Ошибка при экспорте версии в архив', type: 'error', },
        [VersionManagerErrorCode.LaunchFailed]: { message: 'Ошибка при запуске версии продукта', type: 'error', },
        [VersionManagerErrorCode.ExecutableNotFound]: { message: 'Исполняемый файл не найден в установленной версии', type: 'error', },
        [VersionManagerErrorCode.MetaFileMissing]: { message: 'Архив экспорта повреждён: отсутствует meta.json', type: 'error', },
      },
    [EventScope.Misc]: {
        0: { message: 'Неизвестная ошибка', type: 'error' },
        1: { message: 'Обращение успешно зарегистрировано', type: 'success' },

    },
    [EventScope.Guardant]: {
        [GuardantStatus.OK]: { message: 'Успешно', type: 'success' },
        [GuardantStatus.INVALID_HANDLE]: { message: 'Неверный дескриптор', type: 'error' },
        [GuardantStatus.FEATURE_NOT_FOUND]: { message: 'Функция не найдена', type: 'error' },
        [GuardantStatus.FEATURE_RESOURCE_EXHAUST]: { message: 'Ресурс функции исчерпан', type: 'error' },
        [GuardantStatus.INVALID_FEATURE]: { message: 'Недопустимая функция', type: 'error' },
        [GuardantStatus.INVALID_SERIAL_NUMBER]: { message: 'Неверный серийный номер', type: 'error' },
        [GuardantStatus.INVALID_LICENSE]: { message: 'Лицензия недействительна', type: 'error' },
        [GuardantStatus.LICENSE_NOT_ACTIVATED]: { message: 'Лицензия не активирована', type: 'error' },
        [GuardantStatus.LICENSE_ALREADY_ACTIVATED]: { message: 'Лицензия уже активирована', type: 'error' },
        [GuardantStatus.GET_HARDWARE_ID_ERROR]: { message: 'Ошибка получения аппаратного ID', type: 'error' },
        [GuardantStatus.NOT_ENOUGH_HARWARE_TO_BIND]: { message: 'Недостаточно оборудования для привязки', type: 'error' },
        [GuardantStatus.REQUEST_FAILED]: { message: 'Запрос не выполнен', type: 'error' },
        [GuardantStatus.GET_RESPONSE_FAILED]: { message: 'Ошибка получения ответа от сервера', type: 'error' },
        [GuardantStatus.SERVER_NOT_FOUND]: { message: 'Сервер не найден', type: 'error' },
        [GuardantStatus.INCORRECT_RESPONSE_DATA]: { message: 'Неверные данные ответа', type: 'error' },
        [GuardantStatus.FILE_CREATION_ERROR]: { message: 'Ошибка создания файла', type: 'error' },
        [GuardantStatus.SERIAL_NUMBER_RESOURCE_EXHAUSTED]: { message: 'Серийные номера исчерпаны', type: 'error' },
        [GuardantStatus.NO_UPDATES_AVAILABLE]: { message: 'Обновления отсутствуют', type: 'info' },
        [GuardantStatus.ACTIVATION_NOT_AVAILABLE]: { message: 'Активация недоступна', type: 'error' },
        [GuardantStatus.NO_CUSTOMER_SPECIFIED]: { message: 'Клиент не указан', type: 'error' },
        [GuardantStatus.CAN_NOT_ACTIVATE_NON_DEMO_LICENSE]: { message: 'Невозможно активировать недемо-лицензию', type: 'error' },
        [GuardantStatus.OUTDATED_API_VERSION]: { message: 'Устаревшая версия API', type: 'warning' },
        [GuardantStatus.INVALID_PARAMETER]: { message: 'Недопустимый параметр', type: 'error' },
        [GuardantStatus.BUFFER_TOO_SMALL]: { message: 'Буфер слишком мал', type: 'error' },
        [GuardantStatus.INTERNAL_ERROR]: { message: 'Внутренняя ошибка Guardant', type: 'error' },
        [GuardantStatus.LICENSE_IS_BANNED]: { message: 'Лицензия заблокирована', type: 'error' },
        [GuardantStatus.NO_LICENSE_AVAILABLE]: { message: 'Нет доступной лицензии', type: 'error' },
        [GuardantStatus.FEATURE_RUNCOUNTER_EXHAUST]: { message: 'Счётчик запусков функции исчерпан', type: 'error' },
        [GuardantStatus.FEATURE_EXPIRED]: { message: 'Срок действия функции истёк', type: 'error' },
        [GuardantStatus.INVALID_PUBLIC_KEY]: { message: 'Неверный публичный ключ', type: 'error' },
        [GuardantStatus.NO_SERVICE]: { message: 'Служба недоступна', type: 'error' },
        [GuardantStatus.UNABLE_SEND_REQUEST_TO_ADMIN_RUNTIME]: { message: 'Невозможно отправить запрос администратору', type: 'error' },
        [GuardantStatus.DONGLE_NOT_FOUND]: { message: 'Ключ не найден', type: 'error' },
        [GuardantStatus.NO_RESULTS_FOUND]: { message: 'Результаты не найдены', type: 'info' },
        [GuardantStatus.INVALID_DIGEST]: { message: 'Неверная контрольная сумма', type: 'error' },
        [GuardantStatus.FEATURE_INACTIVE]: { message: 'Функция неактивна', type: 'error' },
        [GuardantStatus.MEMORY_OUT_OF_RANGE]: { message: 'Выход за пределы памяти', type: 'error' },
        [GuardantStatus.ACCESS_DENIED]: { message: 'Доступ запрещён', type: 'error' },
        [GuardantStatus.NUMBER_ATTEMPTS_EXHAUSTED]: { message: 'Число попыток исчерпано', type: 'error' },
        [GuardantStatus.SERIAL_NUMBER_NOT_FOUND]: { message: 'Серийный номер не найден', type: 'error' },
        [GuardantStatus.GRD_INVALID_MEMORY]: { message: 'Недопустимая память', type: 'error' },
        [GuardantStatus.VIRTUAL_ENVIRONMENT_DETECTED]: { message: 'Обнаружена виртуальная среда', type: 'warning' },
        [GuardantStatus.REMOTE_DESKTOP_DETECTED]: { message: 'Обнаружен удалённый рабочий стол', type: 'warning' },
        [GuardantStatus.OUTDATED_GCC_VERSION]: { message: 'Устаревшая версия GCC', type: 'warning' },
        [GuardantStatus.REHOST_IS_NOT_ALLOWED]: { message: 'Повторная привязка запрещена', type: 'error' },
        [GuardantStatus.STORAGE_CORRUPTED]: { message: 'Хранилище повреждено', type: 'error' },
        [GuardantStatus.STORAGE_ID_MISMATCH]: { message: 'Несовпадение ID хранилища', type: 'error' },
        [GuardantStatus.INVALID_UPDATE_OR_ALREADY_INSTALLED]: { message: 'Неверное обновление или уже установлено', type: 'info' },
        [GuardantStatus.INVALID_REHOST_DATA]: { message: 'Недопустимые данные повторной привязки', type: 'error' },
        [GuardantStatus.HARDWARE_ID_MISMATCH]: { message: 'Несовпадение аппаратного ID', type: 'error' },
        [GuardantStatus.REACTIVATION_IS_NOT_ALLOWED]: { message: 'Повторная активация запрещена', type: 'error' },
        [GuardantStatus.RECIPIENT_HAS_THE_SAME_LICENSE]: { message: 'У получателя уже есть такая лицензия', type: 'info' },
        [GuardantStatus.CAN_NOT_DETACH_SOME_FEATURES]: { message: 'Некоторые функции невозможно отсоединить', type: 'error' },
        [GuardantStatus.CANCEL_PREVIOUS_DETACH_REQUIRED]: { message: 'Необходимо отменить предыдущее отсоединение', type: 'warning' },
        [GuardantStatus.DETACHED_LICENSE_EXPIRED]: { message: 'Срок действия отсоединённой лицензии истёк', type: 'error' },
        [GuardantStatus.DETACHED_LICENSE_NOT_FOUND]: { message: 'Отсоединённая лицензия не найдена', type: 'error' },
        [GuardantStatus.DETACH_FORBIDDEN_BY_GCC]: { message: 'Отсоединение запрещено GCC', type: 'error' },
        [GuardantStatus.TRIAL_LICENSE_EXPIRED]: { message: 'Пробная лицензия истекла', type: 'error' },
        [GuardantStatus.ORERATION_IS_NOT_ALLOWED]: { message: 'Операция запрещена', type: 'error' },
        [GuardantStatus.RTC_ERROR]: { message: 'Ошибка системного времени', type: 'error' },
        [GuardantStatus.FUNCTION_NOT_FOUND]: { message: 'Функция не найдена в DLL', type: 'error' },
        [GuardantStatus.DLL_NOT_FOUND]: { message: 'DLL не найдена', type: 'error' },
        [GuardantStatus.MANAGE_ERROR]: { message: 'Ошибка управления Guardant', type: 'error' },
    },
};
