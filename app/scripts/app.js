'use strict';

/**
 * @ngdoc overview
 * @name playerApp
 * @description
 * # playerApp
 *
 * Main module of the application.
 */
angular
    .module('playerApp', [
        'ngCookies',
        'ngRoute',
        'playerApp.config',
        'ui.router',
        'ngStorage',
        'ui.pagedown',
        'pdf',
        'pascalprecht.translate',
        'ngSanitize',
        'Scope.safeApply'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, $provide) {
        $provide.provider('setResourceBundle', function() {
            this.$get = function() {
                return function(language, resourceBundle) {
                    $translateProvider.translations(language, resourceBundle);
                    $translateProvider.preferredLanguage(language);
                    $translateProvider.useSanitizeValueStrategy('sanitize');
                    return true;
                };
            };
        });

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('LandingPage', {
                url: '/',
                templateUrl: '/views/home/landingPage.html',
                controller: 'AuthCtrl as auth'
            })
            .state('Home', {
                url: '/home',
                templateUrl: '/views/home/home.html',
                controller: 'HomeController as homeCtrl'
            })
            .state('UserContent', {
                url: '/content',
                templateUrl: '/views/content/usercontent.html',
                controller: 'userContentCtrl as userContent',
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                }
            })
            .state('Learn', {
                url: '/learn',
                templateUrl: '/views/learn/learn.html',
                controller: 'LearnCtrl as learn',
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Course';
                    $rootScope.isLearnPage = true;

                },
                onExit: function($rootScope) {
                    $rootScope.isLearnPage = false;
                },
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                },
                params: { searchKey: 'Course' }
            })
            .state('Resource', {
                url: '/resources',
                templateUrl: '/views/resource/resource.html',
                controller: 'resourceCtrl as resource',
                onEnter: function($rootScope) {
                    $rootScope.searchKey = 'Resources';
                    $rootScope.isResourcesPage = true;

                },
                onExit: function($rootScope) {
                    $rootScope.isResourcesPage = false;
                },
                resolve: {
                    isLoggedIn: function(authService) {
                        authService.validUser();
                    }
                },
                params: { searchKey: 'Resources' }
            })
            .state('note', {
                url: '/note',
                templateUrl: 'views/note/noteList.html',
                controller: 'NoteCtrl',
            })
            //            .state('Course', {
            //                url: '/course/:courseId',
            //                templateUrl: 'views/course/courses.html',
            //                controller: 'CourseCtrl as courses'
            //            })
            .state('Toc', {
                url: '/toc',
                templateUrl: 'views/course/toc.html',
                params: { courseType: null, courseId: null, lectureView: null },
                controller: 'courseScheduleCtrl as toc'
            })
            .state('Community', {
                url: '/community',
                templateUrl: 'views/community/communityList.html',
                controller: 'CommunityController as commCtrl'
            });
    });