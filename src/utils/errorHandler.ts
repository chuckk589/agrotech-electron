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
        [GuardantStatus.OK]: { message: 'Операция выполнена успешно', type: 'success' },
        [GuardantStatus.INVALID_HANDLE]: { message: 'Недопустимый дескриптор сессии', type: 'error' },
        [GuardantStatus.FEATURE_NOT_FOUND]: { message: 'Запрошенный компонент (Feature) не найден', type: 'error' },
        [GuardantStatus.FEATURE_RESOURCE_EXHAUST]: { message: 'Исчерпан ресурс сетевых лицензий для компонента (Feature)', type: 'error' },
        [GuardantStatus.INVALID_FEATURE]: { message: 'Недопустимые лицензионные условия для компонента (Feature)', type: 'error' },
        [GuardantStatus.INVALID_SERIAL_NUMBER]: { message: 'Неверный серийный номер', type: 'error' },
        [GuardantStatus.INVALID_LICENSE]: { message: 'Неверный файл лицензии', type: 'error' },
        [GuardantStatus.LICENSE_NOT_ACTIVATED]: { message: 'Лицензия не была активирована', type: 'error' },
        [GuardantStatus.LICENSE_ALREADY_ACTIVATED]: { message: 'Лицензия уже активирована', type: 'error' },
        [GuardantStatus.GET_HARDWARE_ID_ERROR]: { message: 'Ошибка получения компонентов оборудования для привязки лицензии', type: 'error' },
        [GuardantStatus.NOT_ENOUGH_HARWARE_TO_BIND]: { message: 'Недостаточно компонентов оборудования для привязки лицензии', type: 'error' },
        [GuardantStatus.REQUEST_FAILED]: { message: 'Ошибка отправки запроса на сервер активации', type: 'error' },
        [GuardantStatus.GET_RESPONSE_FAILED]: { message: 'Ошибка приема ответа от сервера активации', type: 'error' },
        [GuardantStatus.SERVER_NOT_FOUND]: { message: 'Сервер активации не найден', type: 'error' },
        [GuardantStatus.INCORRECT_RESPONSE_DATA]: { message: 'Получен неверный ответ от сервера активации', type: 'error' },
        [GuardantStatus.FILE_CREATION_ERROR]: { message: 'Ошибка создания файла лицензии', type: 'error' },
        [GuardantStatus.SERIAL_NUMBER_RESOURCE_EXHAUSTED]: { message: 'Исчерпано количество активаций для серийного номера', type: 'error' },
        [GuardantStatus.NO_UPDATES_AVAILABLE]: { message: 'Не обнаружено обновлений для лицензии', type: 'error' },
        [GuardantStatus.ACTIVATION_NOT_AVAILABLE]: { message: 'Невозможно активировать лицензию, обратитесь к вендоу', type: 'error' },
        [GuardantStatus.NO_CUSTOMER_SPECIFIED]: { message: 'Не указана информация о покупателе', type: 'error' },
        [GuardantStatus.CAN_NOT_ACTIVATE_NON_DEMO_LICENSE]: { message: 'Невозможно активировать распространяемую лицензию', type: 'error' },
        [GuardantStatus.OUTDATED_API_VERSION]: { message: 'Устаревшая версия API', type: 'warning' },
        [GuardantStatus.INVALID_PARAMETER]: { message: 'Недопустимый параметр', type: 'error' },
        [GuardantStatus.BUFFER_TOO_SMALL]: { message: 'Недостаточный размер буфера, операция не может быть выполнена', type: 'error' },
        [GuardantStatus.INTERNAL_ERROR]: { message: 'Произошла внутренняя ошибка API', type: 'error' },
        [GuardantStatus.LICENSE_IS_BANNED]: { message: 'Лицензия заблокирована вендором', type: 'error' },
        [GuardantStatus.NO_LICENSE_AVAILABLE]: { message: 'Нет доступных лицензий', type: 'error' },
        [GuardantStatus.FEATURE_RUNCOUNTER_EXHAUST]: { message: 'Исчерпан счетчик для компонента (Feature)', type: 'error' },
        [GuardantStatus.FEATURE_EXPIRED]: { message: 'Истекло время действия лицензии для компонента (Feature)', type: 'error' },
        [GuardantStatus.INVALID_PUBLIC_KEY]: { message: 'Недопустимый публичный ключ для проверки подписи', type: 'error' },
        [GuardantStatus.NO_SERVICE]: { message: 'Операция не поддерживается', type: 'error' },
        [GuardantStatus.UNABLE_SEND_REQUEST_TO_ADMIN_RUNTIME]: { message: 'Не установлен или не запущен Guardant Control Center', type: 'error' },
        [GuardantStatus.DONGLE_NOT_FOUND]: { message: 'Ключ Guardant не найден', type: 'error' },
        [GuardantStatus.NO_RESULTS_FOUND]: { message: 'Никаких результатов не найдено', type: 'error' },
        [GuardantStatus.INVALID_DIGEST]: { message: 'Недопустимое значение буфера c данными или цифровой подписи', type: 'error' },
        [GuardantStatus.FEATURE_INACTIVE]: { message: 'Период использования компонента (Feature) еще не наступил или компонента (Feature) не активна', type: 'error' },
        [GuardantStatus.MEMORY_OUT_OF_RANGE]: { message: 'Доступ к памяти за пределами ее диапазона', type: 'error' },
        [GuardantStatus.ACCESS_DENIED]: { message: 'Доступ запрещен', type: 'error' },
        [GuardantStatus.NUMBER_ATTEMPTS_EXHAUSTED]: { message: 'Количество попыток ввода пароля было исчерпано', type: 'error' },
        [GuardantStatus.SERIAL_NUMBER_NOT_FOUND]: { message: 'Указанный серийный номер не найден на сервере', type: 'error' },
        [GuardantStatus.GRD_INVALID_MEMORY]: { message: 'Недопустимая память', type: 'error' },
        [GuardantStatus.VIRTUAL_ENVIRONMENT_DETECTED]: { message: 'Обнаружен запуск в виртуальной среде', type: 'error' },
        [GuardantStatus.REMOTE_DESKTOP_DETECTED]: { message: 'Обнаружен запуск в режиме удаленного рабочего стола', type: 'error' },
        [GuardantStatus.OUTDATED_GCC_VERSION]: { message: 'Устаревшая версия Guardant Control Center', type: 'error' },
        [GuardantStatus.REHOST_IS_NOT_ALLOWED]: { message: 'Перенос лицензии запрещен', type: 'error' },
        [GuardantStatus.STORAGE_CORRUPTED]: { message: 'Повреждено хранилище программных ключей Guardant DL', type: 'error' },
        [GuardantStatus.STORAGE_ID_MISMATCH]: { message: 'ID хранилища не подходит для установки\\обновления указанного ключа Guardant DL', type: 'error' },
        [GuardantStatus.INVALID_UPDATE_OR_ALREADY_INSTALLED]: { message: 'Неподходящее или уже установленное обновление Guardant DL', type: 'error' },
        [GuardantStatus.INVALID_REHOST_DATA]: { message: 'Некорректные данные переноса отправлены на сервер лицензирования', type: 'error' },
        [GuardantStatus.HARDWARE_ID_MISMATCH]: { message: 'Некорректный ID аппаратного ключа', type: 'error' },
        [GuardantStatus.REACTIVATION_IS_NOT_ALLOWED]: { message: 'Переактивация Guardant DL запрещена. Лицензии в ключе содержат перезаписываемые ячейки памяти и\\или компоненты, ограниченные по количеству запусков', type: 'error' },
        [GuardantStatus.RECIPIENT_HAS_THE_SAME_LICENSE]: { message: 'Невозможно установить файл переноса, т. к. на принимающем компьютере уже установлена аналогичная лицензия', type: 'error' },
        [GuardantStatus.CAN_NOT_DETACH_SOME_FEATURES]: { message: 'Не удалось выполнить открепление для выбранного компонента', type: 'error' },
        [GuardantStatus.CANCEL_PREVIOUS_DETACH_REQUIRED]: { message: 'Перед откреплением лицензии необходимо выполнить отмену ранее открепленных', type: 'error' },
        [GuardantStatus.DETACHED_LICENSE_EXPIRED]: { message: 'Истек срок открепления лицензии', type: 'error' },
        [GuardantStatus.DETACHED_LICENSE_NOT_FOUND]: { message: 'Не обнаружена открепленная лицензия', type: 'error' },
        [GuardantStatus.DETACH_FORBIDDEN_BY_GCC]: { message: 'Открепление сетевых лицензий запрещено администратором Guardant Control Center', type: 'error' },
        [GuardantStatus.TRIAL_LICENSE_EXPIRED]: { message: 'Истек срок действия пробной лицензии', type: 'error' },
        [GuardantStatus.ORERATION_IS_NOT_ALLOWED]: { message: 'Операция запрещена', type: 'error' },
        [GuardantStatus.RTC_ERROR]: { message: 'Ошибка таймера электронного ключа', type: 'error' },
        [GuardantStatus.FUNCTION_NOT_FOUND]: { message: 'Функция не найдена в DLL', type: 'error' },
        [GuardantStatus.DLL_NOT_FOUND]: { message: 'DLL не найдена', type: 'error' },
        [GuardantStatus.MANAGE_ERROR]: { message: 'Ошибка управления Guardant', type: 'error' },
    },
};
