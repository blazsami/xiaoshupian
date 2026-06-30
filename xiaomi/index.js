        (function() {
            'use strict';

            // ========== DOM 元素缓存 ==========
            const header = document.getElementById('header');
            const topbar = document.getElementById('topbar');
            const hamburger = document.getElementById('hamburger');
            const mobileMenu = document.getElementById('mobileMenu');
            const backToTop = document.getElementById('backToTop');
            const toast = document.getElementById('toast');
            const carouselTrack = document.getElementById('carouselTrack');
            const carouselDots = document.getElementById('carouselDots');
            const carouselPrev = document.getElementById('carouselPrev');
            const carouselNext = document.getElementById('carouselNext');
            const searchInput = document.getElementById('searchInput');
            const cartBtn = document.getElementById('cartBtn');
            const cartCount = document.getElementById('cartCount');
            const userBtn = document.getElementById('userBtn');
            const testDriveBtn = document.getElementById('testDriveBtn');
            const navLinks = document.querySelectorAll('.nav-links a');

            let currentSlide = 0;
            const totalSlides = document.querySelectorAll('.carousel-slide').length;
            let carouselInterval;
            let carouselPaused = false;
            let toastTimer;

            // ========== 轮播图初始化 ==========
            function initCarousel() {
                // 创建指示点
                carouselDots.innerHTML = '';
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('button');
                    dot.setAttribute('type', 'button');
                    dot.setAttribute('role', 'tab');
                    dot.setAttribute('aria-label', '第' + (i + 1) + '张');
                    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                    dot.dataset.index = i;
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', function() {
                        goToSlide(parseInt(this.dataset.index));
                        resetCarouselAuto();
                    });
                    carouselDots.appendChild(dot);
                }
                updateSlidePosition();
                startCarouselAuto();
            }

            function updateSlidePosition() {
                carouselTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
                // 更新指示点
                const dots = carouselDots.querySelectorAll('button');
                dots.forEach(function(dot, index) {
                    dot.classList.toggle('active', index === currentSlide);
                    dot.setAttribute('aria-selected', index === currentSlide ? 'true' : 'false');
                });
            }

            function goToSlide(index) {
                if (index < 0) index = totalSlides - 1;
                if (index >= totalSlides) index = 0;
                currentSlide = index;
                updateSlidePosition();
            }

            function nextSlide() {
                goToSlide(currentSlide + 1);
            }

            function prevSlide() {
                goToSlide(currentSlide - 1);
            }

            function startCarouselAuto() {
                stopCarouselAuto();
                carouselInterval = setInterval(function() {
                    if (!carouselPaused) {
                        nextSlide();
                    }
                }, 4500);
            }

            function stopCarouselAuto() {
                if (carouselInterval) {
                    clearInterval(carouselInterval);
                    carouselInterval = null;
                }
            }

            function resetCarouselAuto() {
                stopCarouselAuto();
                startCarouselAuto();
            }

            carouselPrev.addEventListener('click', function() {
                prevSlide();
                resetCarouselAuto();
            });
            carouselNext.addEventListener('click', function() {
                nextSlide();
                resetCarouselAuto();
            });

            // 鼠标悬停暂停轮播
            const heroSection = document.getElementById('heroCarousel');
            heroSection.addEventListener('mouseenter', function() {
                carouselPaused = true;
            });
            heroSection.addEventListener('mouseleave', function() {
                carouselPaused = false;
            });

            // 触摸滑动支持
            let touchStartX = 0;
            let touchEndX = 0;
            heroSection.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            heroSection.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                    resetCarouselAuto();
                }
            });

            // 键盘导航
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft' && document.activeElement === document.body) {
                    prevSlide();
                    resetCarouselAuto();
                } else if (e.key === 'ArrowRight' && document.activeElement === document.body) {
                    nextSlide();
                    resetCarouselAuto();
                }
            });

            initCarousel();

            // ========== 导航栏滚动效果 ==========
            let lastScrollY = window.pageYOffset;
            let ticking = false;

            function updateHeaderOnScroll() {
                const scrollY = window.pageYOffset;
                if (scrollY > 20) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                // 回到顶部按钮
                if (scrollY > 500) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
                lastScrollY = scrollY;
                ticking = false;
            }

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(updateHeaderOnScroll);
                    ticking = true;
                }
            }, { passive: true });

            // 初始检查
            updateHeaderOnScroll();

            // ========== 回到顶部 ==========
            backToTop.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // ========== 移动端菜单 ==========
            function toggleMobileMenu() {
                const isOpen = mobileMenu.classList.contains('open');
                if (isOpen) {
                    mobileMenu.classList.remove('open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                } else {
                    mobileMenu.classList.add('open');
                    hamburger.classList.add('active');
                    hamburger.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                }
            }

            hamburger.addEventListener('click', toggleMobileMenu);

            // 点击移动端菜单链接后关闭菜单
            mobileMenu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    if (mobileMenu.classList.contains('open')) {
                        toggleMobileMenu();
                    }
                });
            });

            // 点击外部关闭菜单
            document.addEventListener('click', function(e) {
                if (mobileMenu.classList.contains('open') &&
                    !mobileMenu.contains(e.target) &&
                    !hamburger.contains(e.target)) {
                    toggleMobileMenu();
                }
            });

            // ESC关闭菜单
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                    toggleMobileMenu();
                }
            });

            // ========== Toast 提示 ==========
            function showToast(message) {
                if (toastTimer) clearTimeout(toastTimer);
                toast.textContent = message;
                toast.classList.add('show');
                toastTimer = setTimeout(function() {
                    toast.classList.remove('show');
                }, 2000);
            }

            // ========== 搜索框交互 ==========
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        showToast('🔍 正在搜索：' + query + ' ...');
                        searchInput.value = '';
                        searchInput.blur();
                    } else {
                        showToast('请输入搜索关键词');
                    }
                }
            });
            searchInput.addEventListener('focus', function() {
                searchInput.parentElement.style.boxShadow = '0 0 0 3px rgba(255,105,0,0.08)';
            });
            searchInput.addEventListener('blur', function() {
                searchInput.parentElement.style.boxShadow = '';
            });

            // ========== 购物车按钮 ==========
            let cartValue = 2;
            cartBtn.addEventListener('click', function() {
                cartValue++;
                cartCount.textContent = cartValue;
                showToast('🛒 商品已加入购物车！(共' + cartValue + '件)');
                // 购物车动画
                cartCount.style.transform = 'scale(1.5)';
                setTimeout(function() {
                    cartCount.style.transform = 'scale(1)';
                }, 200);
            });

            // ========== 用户按钮 ==========
            userBtn.addEventListener('click', function() {
                showToast('👤 请登录您的小米账号');
            });

            // ========== 试驾按钮 ==========
            if (testDriveBtn) {
                testDriveBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showToast('🚗 试驾预约已提交！顾问将在24小时内联系您');
                });
            }

            // ========== 产品卡片点击反馈 ==========
            document.querySelectorAll('.product-card').forEach(function(card) {
                card.addEventListener('click', function(e) {
                    // 不阻止默认行为，但添加反馈
                    const name = card.querySelector('.card-name');
                    if (name) {
                        // 短暂延迟以展示点击效果
                        card.style.transform = 'scale(0.97)';
                        setTimeout(function() {
                            card.style.transform = '';
                        }, 150);
                    }
                });
            });

            // ========== 导航链接激活状态 ==========
            navLinks.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    navLinks.forEach(function(l) { l.classList.remove('active'); });
                    this.classList.add('active');
                });
            });

            // ========== 窗口大小改变时更新 ==========
            let resizeDebounce;
            window.addEventListener('resize', function() {
                clearTimeout(resizeDebounce);
                resizeDebounce = setTimeout(function() {
                    updateSlidePosition();
                    // 在大屏幕上关闭移动菜单
                    if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
                        toggleMobileMenu();
                    }
                }, 200);
            });

            // ========== 键盘快捷操作 ==========
            document.addEventListener('keydown', function(e) {
                // Ctrl+K 聚焦搜索
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                }
            });

            // ========== 初始状态设置 ==========
            console.log('%c🚀 小米官网模拟页面已就绪 %c| %c2025年9月-10月版本',
                'color:#ff6900;font-weight:bold;font-size:14px;',
                '',
                'color:#888;');
            console.log('%c✨ 功能：轮播图 | 搜索 | 购物车 | 移动端菜单 | 试驾预约 | 回到顶部',
                'color:#555;font-size:12px;');
            console.log('%c📱 支持响应式布局 | 符合W3C标准 | 纯原生JS实现',
                'color:#999;font-size:11px;');

            // 页面加载时的小动画
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.4s ease';
            window.requestAnimationFrame(function() {
                document.body.style.opacity = '1';
            });

        })();